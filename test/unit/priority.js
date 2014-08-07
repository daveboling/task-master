'use strict';
/* global describe, it, before, beforeEach */
/* jshint expr:true*/

var expect = require('chai').expect;
var Priority = require('../../app/models/priority');
var connection = require('../../app/lib/mongodb');
var Mongo = require('mongodb');
var p1;

describe('Priority', function() {
    before(function(done){
       connection('taskmaster', function(){
             done();
          });
    });

     beforeEach(function(done){
        Priority.collection.remove(function(){
          p1 = new Priority({name:'high', color:'red', value:15});
           p1.save(function(){
              done();
           });
        });
     });


     describe('constructor', function(){
      it('should create a priority object', function(){
        expect(p1.name).to.equal('high');
        expect(p1.color).to.equal('red');
        expect(p1.value).to.equal(15);
      });
     });

     describe('#save', function(){
      it('should add an items to the priority database', function(done){
        p1.save(function(){
          expect(p1._id).to.instanceof(Mongo.ObjectID);
          done();
        }); 
      });
     });

     describe('.all', function(){
       it('should return all priorties from the database', function(done){
           Priority.all(function(p){
             expect(p.length).to.equal(1);
             done();
           });
       });
     });

     describe('.findById', function(){
        it('should find a specific priority based on its ObjectID', function(done){
          var id = p1._id;
          Priority.findById(id, function(d){
            expect(d.name).to.equal('high');
            done();
          });
        });
     });
});



