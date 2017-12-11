// error messages

// 200- OK; Standard response for successful HTTP requests
// 201- Created; Request has been fulfilled. New resource created
// 204- No Content; Request processed. No content returned
// 301- Moved Permanently; This and all future requests directed to the given URI
// 304- Not Modified; Resource has not been modified since last requested
// 400- Bad Request; Request cannot be fulfilled due to bad syntax
// 401- Unauthorized; Authentication is possible, but has failed
// 403- Forbidden; Server refuses to respond to request
// 404- Not Found; Requested resource could not be found
// 500- Internal Server Error; Generic error message when server fails
// 501- Not Implemented; Server does not recognize method or lacks ability to fulfill
// 503- Service Unavailable; Server is currently unavailable


// process.on('uncaughtException', function(err) {
//    console.error(err);
//    console.log("Node NOT Exiting...Uncaught Exception<<<<<<<<<");
// });


// response: {
//   result: success,
//   data: {
//     users: [],
//     user: {}
//   }
// }

// response: {
//   result: error,
//   error: {
//     code: ERR,
//     name: ValidationError,
//     type: warning,Forbidden, NotFound, Unauthorized,
//     msg: error message,
//     info: try this to avoid this,
//     errors: []
//   }
// }

// {
//   'E500': {

//   }
// }
