'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  domain: {
    url: 'http://localhost:5000',
    version: 'v1',
  },
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/jiraAPI',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      stream: {
        directoryPath: process.cwd(),
        fileName: 'access.log',
        rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
          active: false, // activate to use rotating logs
          fileName: 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
          frequency: 'daily',
          verbose: false
        }
      }
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '993139484046-0tqkbr5jo3srvvka7caifb6p7g9jd1ve.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'FYXklxFJCvrhKEi7LTjlO3xC',
    callbackURL: 'http://localhost:5000/api/v1/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:5000/api/v1/auth/linkedin/callback'
  }, 
  facebook: {
    clientID: process.env.FACEBOOK_CLIENTID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:5000/api/v1/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_CLIENTID || 'APP_ID',
    clientSecret: process.env.TWITTER_SECRET || 'APP_SECRET',
    callbackURL: 'http://localhost:5000/api/v1/auth/twitter/callback'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'amit.sengar@xcdify.com',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'mailgun',
      domain: 'localhost',
      // driver: 'smtp' || 'mailgun,
      // secret: 'key-5bafff675168c328be2f4726d8389d14',
      // host: 'smpt.mailgun.org',
      port: '587',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'amit.sengar@xcdify.com',
        pass: process.env.MAILER_PASSWORD || '000'
      }
    }
  },
  livereload: true,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true' ? true : false,
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS === 'false' ? false : true,
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'user',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  }
};
