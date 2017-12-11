'use strict';

// Load the module dependencies
var config = require('./config'),
  path = require('path'),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  cookieParser = require('cookie-parser'),
  passport = require('passport'),
  passportJWT = require('passport-jwt'),
  JwtStrategy = passportJWT.Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  AuthModel = require('mongoose').model('Auth'),
  socketio = require('socket.io'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session);
var cookie = require('cookie');
// Define the Socket.io configuration method
module.exports = function (app, db) {
  var server;

  if (config.secure && config.secure.ssl === true) {
    // Load SSL key and certificate
    var privateKey = fs.readFileSync(path.resolve(config.secure.privateKey), 'utf8');
    var certificate = fs.readFileSync(path.resolve(config.secure.certificate), 'utf8');
    var options = {
      key: privateKey,
      cert: certificate,
      //  requestCert : true,
      //  rejectUnauthorized : true,
      secureProtocol: 'TLSv1_method',
      ciphers: [
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'DHE-RSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES128-SHA256',
        'DHE-RSA-AES128-SHA256',
        'ECDHE-RSA-AES256-SHA384',
        'DHE-RSA-AES256-SHA384',
        'ECDHE-RSA-AES256-SHA256',
        'DHE-RSA-AES256-SHA256',
        'HIGH',
        '!aNULL',
        '!eNULL',
        '!EXPORT',
        '!DES',
        '!RC4',
        '!MD5',
        '!PSK',
        '!SRP',
        '!CAMELLIA'
      ].join(':'),
      honorCipherOrder: true
    };

    // Create new HTTPS Server
    server = https.createServer(options, app);
  } else {
    // Create a new HTTP server
    server = http.createServer(app);
  }


  // Create a new Socket.io server
  var io = socketio.listen(server);

  // Create a MongoDB storage object
  var mongoStore = new MongoStore({
    mongooseConnection: db.connection,
    collection: config.sessionCollection,
    cookie: {
      path: "/",
    }
  });

  // Intercept Socket.io's handshake request
  io.use(function (socket, next) {
    try {
      var req = socket.request;
     // next(null, true);
      var opts = {};
      opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
      opts.secretOrKey = config.jwtSuperSecret;
      passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        AuthModel.findById(jwt_payload.id, function (err, auth) {
          if (err) {
            return done(err, false);
          }
          if (auth) {
            done(null, auth);
          } else {
            done(null, false);
          }
        });
      }));
      // Use the 'cookie-parser' module to parse the request cookies

      cookieParser(config.sessionSecret)(socket.request, {}, function (err) {
        // Get the session id from the request cookies
        var cookies = cookie.parse(socket.handshake.headers['cookie']);
        var sessionId = socket.handshake.headers.cookie ? cookies['connect.sid'].split('.')[0].split(':')[1] : undefined;
        console.log('session ID ( %s )', sessionId);

        if (!sessionId) return next(new Error('sessionId was not found in socket.request'), false);

        // Use the mongoStorage instance to get the Express session information
        mongoStore.get(sessionId, function (err, session) {
          if (err) return next(err, false);
          if (!session) return next(new Error('session was not found for ' + sessionId), false);

          // Set the Socket.io session information
          socket.request.session = session;

          // Use Passport to populate the user details
          passport.initialize()(socket.request, {}, function () {
            passport.session()(socket.request, {}, function () {
              if (socket.request.user) {
                next(null, true);
              } else {
                next(new Error('User is not authenticated'), false);
              }
            });
          });
        });
      });
    } catch (err) {
      console.error(err.stack);
      next(new Error('Internal server error'));
    }
  });

  // Add an event listener to the 'connection' event
  io.sockets.on('connection', function (socket) {
    var _socket = socket;
    console.log('Dashboard Connected through Socket.io');
    _socket.emit("connection", "connected!!");

    config.files.server.sockets.forEach(function (socketConfiguration) {
      require(path.resolve(socketConfiguration))(io, _socket);
    });

    socket.on('disconnect', function () {
      console.log('Socket connection disconnected!');
      _socket.emit("Socket connection disconnected!");
    });
 
    console.log('Someone connected');

    socket.on('echo', function (data) {
      io.sockets.emit('echo', data);
      //socket.emit('notification',"lsdfkljsdlfjklsdjflkjsklfjklsdjf")
    });

    socket.on('echo-ack', function (data, callback) {
      callback(data);
    });
  });
  io.sockets.on('error', function (err) {
    console.log(err);
    // do something with err
  });
  return server;
};