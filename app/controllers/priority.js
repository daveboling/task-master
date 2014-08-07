'use strict';

var Priority = require('../models/priority');

exports.index = function(req, res){
	Priority.all(function(p){
		res.render('priorities/index', {priorities: p});
	});
};

exports.init = function(req, res){
  res.render('priorities/priority-init');
};

exports.create = function(req, res){
	var p = new Priority(req.body);
	p.save(function(){
		res.redirect('/priorities');
	});
};