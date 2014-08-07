'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');
var moment = require('moment');
var Priority = require('./priority');
var async = require('async');

function Task(p){
  this.name  	  = p.name;
  this.due   	  = moment(p.due).format('M/D/YYYY');
  this.photo 	  = p.photo;
  this.tags  	  = p.tags.split(', ');
  this.priorityId = p.priorityId;
 

  this.isComplete = false;
}

Object.defineProperty(Task, 'collection', {
  get: function(){return global.mongodb.collection('tasks');}
});

Task.prototype.save = function(cb){
  Task.collection.save(this, cb);
};

Task.all = function(cb){
  Task.collection.find().toArray(function(err, objects){
    var task = objects.map(function(t){
      return changePrototype(t);
    });


    async.each(task, 
      function(e, callback){
        Priority.findById(e.priorityId, function(addPriority){
          e.priority = addPriority;
          //why the eff does this work?
          task[0] = e;
          callback();
        });
      }, 
      function(err){
        if(err){
          console.log('There was an error putting Priorities into Tasks.');
        } else {
          console.log('Priorities added to tasks.');
          console.log(task);
          cb(task);
        }
        
    });
  });
};

Task.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
    
  Task.collection.findOne({_id:_id}, function(err, obj){
    var task = changePrototype(obj);

    cb(task);
  });
};



//PRIVATE FUNCTIONS//

function changePrototype(obj){
  return _.create(Task.prototype, obj);
}


module.exports = Task;