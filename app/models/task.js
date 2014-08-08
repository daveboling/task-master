'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');
var moment = require('moment');
var Priority = require('./priority');
var async = require('async');

function Task(p){
  this.name  	  = p.name;
  //This must be a JavaScript date object in order for MongoDB to be able to sort it
  this.due   	  = new Date(p.due);
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

//Task.prototype.isComplete


//demonstrates single responsibility principle
Task.all = function(page, filter, sort, cb){

  //default parameters
  page   = (page) ? (parseInt(page) - 1) * 3 : 1;
  if(!sort) { sort = -1; }
  else if(sort > 0) { sort = -1; }
  else { sort = 1}
  filter = (filter) ? {tags: filter} : {};

  //sort can be 1 for descending and -1 for ascending
  Task.collection.find(filter).limit(3).skip(page).sort({due: sort}).toArray(function(err, objects){
    var tasks = objects.map(function(t){
      return changePrototype(t);
    });

  //async map is in place to add priority objects to task objects 
  //when we query for them. async.map(array, fn(item, cb), fn(err, newObj))
  async.map(tasks, 
     
     function(task, callback){
       Priority.findById(task.priorityId, function(priority){
         task.priority = priority;
         callback(null, task);
       });
     }, 

     function(err, mappedTasks){
        //collection count returns the current # of models in a given collection
        //A filter can be passed in as a parameter in order to limit count based on filter
        Task.collection.count(filter, function(err, count){
          //the callback to Task.all will send the newly mapped object and the count / 3 (because we're displaying only 3 per page)
          console.log(sort);
          cb(mappedTasks, Math.round(count / 3));
        });
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

function addPriority(task, callback) {
  Priority.findById(task._id, function(priority){
    task.priority = priority;
  });
}

module.exports = Task;