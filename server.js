const http = require("http");
const express = require('express');
const mongoURL = 'mongodb://evildice:r3v3ng3@ds129090.mlab.com:29090/evildice';
const server = express();
const THE_PORT = 5000;

const MongoClient = require('mongodb').MongoClient;

function addTask(task, succesCallback, errorCallback) {
    MongoClient.connect(mongoURL, function(err, db) {
      if (err) throw err;
      var dbo = db.db("evildice");
      dbo.collection("memtasks").insertOne(task, function(err, res) {
        if (err) {
            errorCallback();
        }
        console.log("1 document inserted");
        db.close();
        succesCallback();
      });
    });
}


function getAllTasks(successCallback, errorCallback) {
    MongoClient.connect(mongoURL, function(err, db) {
      if (err) throw err;
      var dbo = db.db("evildice");
      var tskRes =  dbo.collection("memtasks").find();
      var allValues = [];
      tskRes.each(function(err, item){
          if (err) errorCallback();
          if (item == null) {
              db.close();
              successCallback(allValues);
          }
          allValues.push(item);
      });
/*
      console.log(tskRes);
      var stream = tskRes.stream();
      console.log(stream);

      stream.on('error', function(error) {
            errorCallback();
      });
      stream.on('data', function(doc) {
            allValues.push(doc);
      });
      stream.on('end'), function() {
            db.close();
            console.log(allValues);
            successCallback(allValues);
      }
*/
    });
}

server.get('/', function (req, res) {
    var path = require('path');
    res.sendFile(path.resolve(__dirname + '/index.html'));
});

server.listen(THE_PORT, (err) => {
	if ( ! err) {
		console.log(`server is listening on ` + THE_PORT)
	}
});

server.get('/tasks', function(req, res) {
    getAllTasks(
        function(data){
            res.json(data);
        },
        function () {
            res.json({
                result: 'Error',
                message: 'MongoDB Error while adding a task'
            });
        }
    );
    /*res.json([
        { name: 'buy some milk', priority: 4, category: 'home' },
        { name: 'buy 1KG meat', priority: 2, category: 'home' },
        { name: 'search for flights to Cape Town', priority: 1, category: 'travel' },
        { name: 'google modern photography', priority: 3, category: 'research' },
        { name: 'google video efects in nikon DSLR', priority: 5, category: 'research' }
        ]);*/
});

server.post('/tasks/add', function(req, res) {
   console.log(req.headers.task);
   addTask(JSON.parse(req.headers.task), function(){
       res.json({result: 'OK', message: 'Task added'});
   }, function () {
       res.json({result: 'Error', message: 'MongoDB Error while adding a task'});
   });
});
