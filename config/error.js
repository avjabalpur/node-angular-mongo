'use strict';
// https://www.youtube.com/watch?v=9R7Y0JgdD00&t=622s
// https://www.youtube.com/watch?v=p-2fzgfk9AA

process.on('uncaughtException', function(err) {
  console.log('Uncaught Exception Error');
  console.log(err);
  console.log(err.stack);


  // var response = {
  //   result: 'error',
  //   error: {
  //     code: err.code || 'ERR0001',
  //     name: err.name || 'UncaughtException',
  //     type: err.type || 'Error',
  //     message: err.message || 'some thing went wrong',
  //     info: err.info || 'Error occured please try again.',
  //     errors: []
  //   }
  // };

});

function CustomError(message) {
  Error.captureStackTrace(this);
  this.message = message;
  this.name = 'CustomError';
}
CustomError.prototype = Object.create(Error.prototype);

// serverError
// - message
// - services
// - port
// - time


// Conventions
// - Error Object always
// - cb(err) or next(err) and return
// - process.on('uncaughtException') must always process.exit() at end
// - consider using helper function and standard schema for sending errors to client

// handleError = function(err) {

//   logError(err);

//   var message = err ? err.message : 'Internal Server Error';

//   res.send(500, {
//     error: {message: message}
//   });

//   function logError(err) {
//     console.log({
//       message: err.message,
//       stack: err.stack
//     });
//   }
// }
