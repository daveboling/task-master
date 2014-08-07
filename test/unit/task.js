'use strict';
/* global describe, it, before, beforeEach */
/* jshint expr:true*/

var expect = require('chai').expect;
var Priority = require('../../app/models/priority');
var Task = require('../../app/models/task');
var connection = require('../../app/lib/mongodb');
var Mongo = require('mongodb');
var p1;
var t1;


describe('Task', function() {
    before(function(done){
       connection('taskmaster', function(){
             done();
          });
    });

     beforeEach(function(done){
        Task.collection.remove(function(){
        	Priority.collection.remove(function(){
        		p1 = new Priority({name:'high', color:'red', value:15});
          		p1.save(function(){
          			t1 = new Task({name: 'Milk', due:'8-15-2014', photo: 'http://daviddboling.com/dave.jpg', tags:'grocery, dairy', priorityId: p1._id});
          				t1.save(function(){
          					done();
          				});
          		});
        	});
     	});
    });


     describe('constructor', function(){
     	it('should create a new task with a priorityID', function(){
     		expect(t1.name).to.equal('Milk');
     		expect(t1.due).to.equal('8/15/2014');
     		expect(t1.photo).to.equal('http://daviddboling.com/dave.jpg');
     		expect(t1.isComplete).to.be.false;
     		expect(t1.tags[0]).to.equal('grocery');
     		expect(t1.tags[1]).to.equal('dairy');
     	});
     });

     describe('#save', function(){
     	it('should add a task to the tasks collection', function(done){
     		t1.save(function(){
     			expect(t1._id).to.be.instanceof(Mongo.ObjectID);
     			done();
     		});
     	});
     });

     describe('.all', function(){
     	it('should display all tasks in the database', function(done){
     		Task.all(function(task){
     			expect(task.length).to.equal(1);
     			done();
     		});
     	});
     });







 });