'use strict';

var methods = {

}

methods.getAllProjects = function (req, res) {
    req.trackTool.getAllProjects(req).then(function(result){
        res.send(result);
    },function(err){
        res.status(400).send(err);
    });
};
methods.getAllProjectCategories = function (req, res) {
    req.trackTool.getAllProjectCategories(req).then(function(result){
        res.send(result);
    },function(err){
        res.status(400).send(err);
    });
};
methods.jiraConnect = function (req, res) {
    req.trackTool.jiraConnect(req).then(function(result){
        res.send(result);
    },function(err){
        res.status(400).send(err);
    });
};
methods.jiraConnectCallback = function (req, res) {
    req.trackTool.jiraConnectCallback(req).then(function(result){
        res.send(result);
    },function(err){
        res.status(400).send(err);
    });
};
methods.getMyself = function (req, res) {
    req.trackTool.getMyself(req).then(function(result){
        res.send(result);
    },function(err){
        res.status(400).send(err);
    });
};
methods.getAllUsersByProject = function (req, res) {
    req.trackTool.getAllUsersByProject(req).then(function(result){
        res.send(result);
    },function(err){
        res.status(400).send(err);
    });
};
methods.getAllIssuesByProject = function (req, res) {
    req.trackTool.getAllIssuesByProject(req).then(function(result){
        res.send(result);
    },function(err){
        res.status(400).send(err);
    });
};
methods.getIssueById = function (req, res) {
    req.trackTool.getIssueById(req).then(function(result){
        res.send(result);
    },function(err){
        res.status(400).send(err);
    });
};
methods.getAllBoards = function (req, res) {
    req.trackTool.getAllBoards(req).then(function(result){
        res.send(result);
    },function(err){
        res.status(400).send(err);
    });
};
module.exports = methods;