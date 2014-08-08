'use strict';

var Priority = require('../models/priority');
var Task     = require('../models/task');
//Global flags
var currentSort, currentPage, currentTag;

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
	currentPage = req.query.page;
	currentTag  = req.query.tag;
	currentSort = req.query.sort;

	Task.all(currentPage, currentTag, currentSort, function(tasks, count){
		res.render('tasks/index', {tasks: tasks, page: currentPage, tag: currentTag, sort: currentSort, count: count});
	});
};
