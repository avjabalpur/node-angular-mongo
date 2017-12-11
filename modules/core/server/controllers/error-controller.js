'use strict';

var _ = require('lodash');

var defaultErrorMessage = function (msg) {
  return {
    response: {
      status: 'error',
      error: {
        code: 'ERR0001',
        name: 'UndefinedError',
        type: 'Error',
        msg: msg || 'Something went wrong',
        info: '',
        errors: []
      }
    }
  };
};

exports.getErrorResponse = function (err) { 
  var response = {
    status: 'error',
    error: {
      code: err.code || 'ERR0001',
      name: err.name || 'UserError',
      type: err.type || 'Warning',
      message: err.message || err || 'Error occured please try again.',
      info: err.info || 'Error occured please try again.',
      errors: []
    }
  };

  return response;
};

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function (err) {
  var output;
  try {
    var fieldName = err.errmsg.substring(err.errmsg.lastIndexOf('index:') + 7, err.errmsg.lastIndexOf('_1'));
    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';
  } catch (ex) {
    output = 'Unique field already exists';
  }
  return output;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function (err) {
  var response = {};
  response.status = 'error';
  response.error = {};
  var message = [];

  if (err.code) {
    response.error.code = 'ERR0001';
    response.error.type = 'Warning';
    switch (err.code) {
      case 11000:
      case 11001:
        response.error.name = 'UniqueError';
        response.error.message = getUniqueErrorMessage(err);
        response.error.info = 'Please try some other unique value';
        break;
      default:
        response = defaultErrorMessage('Something went wrong');
    }
  } else {
    for (var errName in err.errors) {
      // _.omit(err.errors[errName], ['properties', 'name', 'kind', 'path', 'value']);
      err.errors[errName] = _.pick(err.errors[errName], ['message']);
    }
    response.error = err;
    response.error.code = 'ERR0001';
    response.error.type = 'Warning';
    response.error.info = 'Please fill all required fields';
  }

  return response;
};
/**
 * Get the error message from error object
 */
exports.getSuccessMessage = function (data, msg) {
  return {
    response: {
      status: 'success',
      data: data,
      message: msg
    }
  };
};

// exports.validationError = function(err) {

// };

// exports.accessError = function(err) {

// };

// exports.uniqueError = function(err) {

// };

// exports.undefinedError = function(err) {

// };

// Log::emergency($message);
// Log::alert($message);
// Log::critical($message);
// Log::error($message);
// Log::warning($message);
// Log::notice($message);
// Log::info($message);
// Log::debug($message);
