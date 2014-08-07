'use strict';

var morgan = require('morgan');
var bodyParser = require('body-parser');
var home = require('../controllers/home');
var priorities = require('../controllers/priority');
var tasks = require('../controllers/task');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));


  app.get('/', home.index); //home page
  app.get('/priorities/new', priorities.init); //page to create priority
  app.get('/priorities', priorities.index); //show priorities list
  app.post('/priorities/new', priorities.create); //create priority

  app.get('/tasks/new', tasks.init); //page to create tasks
  app.post('/tasks/new', tasks.create); //create tasks
  app.get('/tasks', tasks.index); //show tasks




  console.log('Pipeline Configured');
};

