'use strict';

var Priority = require('../models/priority');
var Task     = require('../models/task');

exports.init = function(req, res){
	Priority.all(function(p){
		res.render('tasks/task-init', {priorities: p});
	});
};

exports.create = function(req, res){
	var t = new Task(req.body);
	t.save(function(){
		res.redirect('/tasks');
	});
};

exports.index = function(req, res){
	Task.all(function(o){
		res.render('tasks/index', {tasks: o});
	});
};