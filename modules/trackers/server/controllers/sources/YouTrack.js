var path = require('path'),
    async = require('async'),
    handler = require(path.resolve('./modules/core/server/controllers/error-controller')) 
    mongoose = require('mongoose'),
    User = mongoose.model('Auth');
var YouTrackFactory = module.exports = function YouTrackFactory(options) {
    this.options = options || {};
}

YouTrack.prototype.getAllProjects = function (req) {
    return new Promise(function (resolve, reject) {
        if (req.user && req.user.id) {
            var userId = req.user.id;
            User.findOne({ _id: userId }).then(function (user) {
                var currentuser = new User(user);
                if (!currentuser.serviceProvider.youtrack) {
                    return handler.getErrorResponse("Jira account is not connected yet");
                }

             
               
                resolve(handler.getSuccessMessage(data, "project details fetched successfully!"));
                
                //   reject(handler.getErrorMessage(err));
               
            });
        }
        else {
            reject(handler.getErrorMessage('no user found'));
        }
    });
};
