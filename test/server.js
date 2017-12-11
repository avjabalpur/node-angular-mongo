// // server.js

// // set up ========================
// var express = require('express');
// var path = require('path');
// var app = express();                               // create our app w/ express
// var mongoose = require('mongoose');                     // mongoose for mongodb
// var morgan = require('morgan');             // log requests to the console (express4)
// var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
// var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// // configuration =================

// //mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io
// var RewriteMiddleware = require('express-htaccess-middleware');
// var RewriteOptions = {
//     file: path.resolve(__dirname, '.htaccess'),
//     verbose: true,
//     watch: true,
// };
// app.use(RewriteMiddleware(RewriteOptions));
// app.use(express.static(__dirname + '/app'));                 // set the static files location /public/img will be /img for users
// app.use(morgan('dev'));                                         // log every request to the console
// app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
// app.use(bodyParser.json());                                     // parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
// app.use(methodOverride());
// // application -------------------------------------------------------------
// app.get('*', function (req, res) {
//     res.sendfile('./app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
// });
// // listen (start app with node server.js) ======================================
// app.listen(8081);
// console.log("App listening on port 8081");
(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();
var express = require('express');
var chieldprocess = require('child_process');
var app = express();
app.use(express.static(__dirname + '/app'));

app.use(function (req, res, next) {
    try{
    var content = '';
    var url = req.protocol + '://' + req.get('host') + req.originalUrl;
    var phantom = require('child_process').spawn('phantomjs', ['phantom-server.js', url]);
    phantom.stdout.setEncoding('utf8');
    phantom.stdout.on('data', function(data) {
        content += data.toString();
    });
    phantom.on('exit', function(status_code) {
        if (status_code !== 0) {
            console.log('error');
        } else {
            res.send(content);  
        }
    });
}catch(ex){

}
});


// // In our app.js configuration
// app.use(function(req, res, next)
// {
// var fragment = req.query._escaped_fragment_;
// // If there is no fragment in the query params
// // then we're not serving a crawler
// if (!fragment) return next();

// // If the fragment is empty, serve the
// // index page

// if (fragment === "" || fragment === "/")
// fragment = "/index.html";

// // If fragment does not start with '/'
// // prepend it to our fragment
// if (fragment.charAt(0) !== "/")
// fragment = '/' + fragment;

// // If fragment does not end with '.html'
// // append it to the fragment
// if (fragment.indexOf('.html') == -1) fragment += ".html";

// // Serve the static html snapshot
// try {
// var file = __dirname + "/app" + fragment; res.sendfile(file);
// } catch (err) { res.send(404);}
//});


app.listen(8888);   
console.log("App listening on port 8888");