
var path = require('path'),
    handler = require(path.resolve('./modules/core/server/controllers/error-controller'));

var Promise = require("bluebird");
var OAuth = require('oauth').OAuth;
var mongoose = require('mongoose'),
    User = mongoose.model('Auth');
var JiraClient = require('jira-connector');

var Jira = module.exports = function JiraFactory(options) {
    this.options = options || {};
}

Jira.prototype.getAllProjects = function (req) {
    return new Promise(function (resolve, reject) {
        if (req.user && req.user.id) {
            var userId = req.user.id;
            User.findOne({ _id: userId }).then(function (user) {
                var currentuser = new User(user);
                if (!(currentuser.serviceProvider.jira) || !currentuser.serviceProvider.jira.host) { ;
                  return reject(handler.getErrorResponse('Jira account is not connected yet'));
                }

                var jj = new JiraClient(currentuser.serviceProvider.jira.toObject());
                jj.project.getAllProjects().then(function (data) {
                    return resolve(handler.getSuccessMessage(data, "project details fetched successfully!"));
                }, function (err) {
                    return   reject(handler.getErrorMessage(err));
                });
            });
        }
        else {
            reject(handler.getErrorResponse('no user found'));
        }
    });
};

Jira.prototype.getAllProjectCategories = function (req) {
    return new Promise(function (resolve, reject) {
        var userId = req.user.id;
        User.findOne({ _id: userId }).then(function (user) {
            var currentuser = new User(user);
            var jj = new JiraClient(currentuser.serviceProvider.jira.toObject());
            jj.projectCategory.getAllProjectCategories().then(function (data) {
               return resolve(handler.getSuccessMessage(data, "Details fetched successfully!"));
            }, function (err) {
               return reject(handler.getErrorMessage(err));
            });
        });
    });
};

Jira.prototype.jiraConnect = function (req) {
    return new Promise(function (resolve, reject) {
        if (req.user && req.user.id) {
            var userId = req.user.id;
            var jiraBase = {
                host: req.body.JiraURL,
                protocol: "https",
                oauth: {
                    consumer_key: req.body.consumerkey,
                    private_key: req.body.privatekey,
                    token_secret: "",
                    token: ""
                }
            }
            User.findOneAndUpdate({ _id: userId }, { $set: { "serviceProvider.jira": jiraBase } }, { new: true }).then(function (user) {
                var cnfg = new Object();
                cnfg.host = user.serviceProvider.jira.host || "";
                cnfg.protocol = user.serviceProvider.jira.protocol || 'https';
                var jj = new JiraClient(cnfg);
                JiraClient.oauth_util.getAuthorizeURL({
                    host: cnfg.host,
                    protocol: cnfg.protocol,
                    oauth: {
                        consumer_key: user.serviceProvider.jira.oauth.consumer_key,
                        private_key: user.serviceProvider.jira.oauth.private_key,
                        callback_url: "http://localhost:5000/jiraCallback" // "http://localhost:5000/api/v1/jira/jiraConnect/callback"
                    }
                }, function (error, oauth) {
                    if (error) { 
                       console.log(error);
                       return reject(handler.getErrorMessage(err));                    
                    }
                    user.serviceProvider.jira.oauth.token_secret = oauth.token_secret;
                    user.serviceProvider.jira.oauth.token = oauth.token;
                    user.save(function (err) {
                        if (err) {
                            console.error('ERROR!');
                           return reject(handler.getErrorMessage(err));
                        }
                    });
                    req.session.jira_access_token = oauth.token;
                    req.session.jira_access_token_secret = oauth.token_secret;
                   return resolve(handler.getSuccessMessage(oauth.url, "Details fetched successfully!"));
                     
                });

            });

        } else {
           return reject(handler.getErrorResponse(err));
           
        }
    });
};

Jira.prototype.jiraConnectCallback = function (req) {
    return new Promise(function (resolve, reject) {
        if (req.user && req.user.id) {
            var userId = req.user.id;
            User.findOne({ _id: userId }).then(function (user) {
                var jiraOauth = {
                    host: user.serviceProvider.jira.host || "",
                    protocol: user.serviceProvider.jira.protocol || 'https',
                    oauth: {
                        token: req.body.oauth_token,
                        token_secret: user.serviceProvider.jira.oauth.token_secret,
                        oauth_verifier: req.body.oauth_verifier,
                        consumer_key: user.serviceProvider.jira.oauth.consumer_key,
                        private_key: user.serviceProvider.jira.oauth.private_key
                    }
                };
                JiraClient.oauth_util.swapRequestTokenWithAccessToken(jiraOauth, function (error, oauthtoken, secret, oauthSession) {
                    console.log(oauthtoken);
                    var cnfg = new Object();
                    cnfg.host = jiraOauth.host;
                    cnfg.protocol = jiraOauth.protocol;
                    cnfg.oauth = {
                        consumer_key: jiraOauth.oauth.consumer_key,
                        private_key: jiraOauth.oauth.private_key,
                        token_secret: secret,
                        token: oauthtoken
                    };
                    req.session.jiraouthconfig = cnfg;
                    // Fetch the user by id 
                    User.findOneAndUpdate({ _id: userId }, { $set: { "serviceProvider.jira.oauth": cnfg.oauth } }, { new: true }).then(function (updatedUser) {
                       return resolve(handler.getSuccessMessage({
                            access_token: oauthtoken,
                            data: updatedUser
                        }, "Details fetched successfully!"));  
                    });
                });
            });
        }
        else {
           return reject(handler.getErrorResponse(err));
        }
    });
};

Jira.prototype.getMyself = function (req) {
    return new Promise(function (resolve, reject) {
        if (req.user && req.user.id) {
            var userId = req.user.id;
            User.findOne({ _id: userId }).then(function (user) {
                var currentuser = new User(user);
                var jj = new JiraClient(currentuser.serviceProvider.jira.toObject());
                jj.search.search({
                    "jql": "project = TER",
                    "maxResults": 15,
                    "fields": [
                        "comment",
                        "aggregateprogress",
                        "worklog",
                        "timetracking"
                    ],
                    "fieldsByKeys": false
                }).then(function (data) {
                  return  resolve(handler.getSuccessMessage(data, "Details fetched successfully!"));
                }, function (err) {
                   return reject(handler.getErrorMessage(err));
                });
                // jj.myself.getMyself().then(function (data) {
                //     next(null, data)
                // }, function (err) {
                //     done(null, err);
                // });
            });
        }
    });
};

Jira.prototype.getAllUsersByProject = function (req) {
    return new Promise(function (resolve, reject) {
        if (req.user && req.user.id) {
            var userId = req.user.id;
            var projectID = req.body.project;
            User.findOne({ _id: userId }).then(function (user) {
                var currentuser = new User(user);
                var jj = new JiraClient(currentuser.serviceProvider.jira.toObject());
                jj.user.searchAssignable({ project: projectID }).then(function (data) {
                  return  resolve(handler.getSuccessMessage(data, "Details fetched successfully!"));
                }, function (err) {
                   return reject(handler.getErrorMessage(err));
                });
            });
        }
    });
};

Jira.prototype.getAllIssuesByProject = function (req) {
    return new Promise(function (resolve, reject) {
        if (req.user && req.user.id) {
            var userId = req.user.id;
            var projectID = req.body.project;
            User.findOne({ _id: userId }).then(function (user) {
                var currentuser = new User(user);
                var jj = new JiraClient(currentuser.serviceProvider.jira.toObject());
                jj.search.search({ project: projectID }).then(function (data) {
                   return resolve(handler.getSuccessMessage(data, "Details fetched successfully!"));
                }, function (err) {
                   return reject(handler.getErrorMessage(err));
                });
            });
        }
    });
};
Jira.prototype.getIssueById = function (req) {
    return new Promise(function (resolve, reject) {
        if (req.user && req.user.id) {
            var userId = req.user.id;
            var issueKey = req.body.issuekey;
            User.findOne({ _id: userId }).then(function (user) {
                var currentuser = new User(user);
                var jj = new JiraClient(currentuser.serviceProvider.jira.toObject());
                jj.issue.getIssue({ issueKey: issueKey }).then(function (data) {
                   return resolve(handler.getSuccessMessage(data, "Details fetched successfully!"));
                }, function (err) {
                   return reject(handler.getErrorMessage(err));
                });
            });
        }
    });
};

Jira.prototype.getAllBoards = function (req) {
    return new Promise(function (resolve, reject) {
        if (req.user && req.user.id) {
            var userId = req.user.id;
            var opts = {
                type: req.body.type || 'scrum',
                startAt: req.body.startAt || 0,
                maxResults: req.body.maxResults || 50
            };
            User.findOne({ _id: userId }).then(function (user) {
                var currentuser = new User(user);
                var jj = new JiraClient(currentuser.serviceProvider.jira.toObject());
                jj.board.getAllBoards(opts).then(function (data) {
                    return resolve(handler.getSuccessMessage(data, "Details fetched successfully!"));
                }, function (err) {
                   return reject(handler.getErrorMessage(err));
                });
            });
        }
    });
};






