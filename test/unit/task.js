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
            p2 = new Priority({name:'high', color:'blue', value:15});
            p3 = new Priority({name:'high', color:'green', value:15});

            p1.save(function(){
                p2.save(function()[
                    p3.save(function(){
                        t2 = new Task({name: 'Bread', due:'8-15-2014', photo: '', tags:'grocery, dairy', priorityId: p1._id});
                        t3 = new Task({name: 'Potatoes', due:'8-15-2014', photo: '', tags:'grocery, dairy', priorityId: p2._id});
                        t4 = new Task({name: 'More Milk', due:'8-15-2014', photo: '', tags:'grocery, dairy', priorityId: p3._id});
                        t5 = new Task({name: 'More bread', due:'8-15-2014', photo: '', tags:'grocery, dairy', priorityId: p2._id});
                        t6 = new Task({name: 'More potatoes', due:'8-15-2014', photo: '', tags:'grocery, dairy', priorityId: p2._id});
                            t2.save(function(){
                                t3.save(function(){
                                    t4.save(function(){
                                        t5.save(function(){
                                            t6.save(function(){

                                            });
                                        });
                                    ]);
                                });
                            });
                    });
                });
            });


     		Task.all(2, function(task){
                expect(task[0].priority.name).to.equal('high');
     			done();
     		});
     	});
     });








 });