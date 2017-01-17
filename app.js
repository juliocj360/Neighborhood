var MongoClient = require('mongodb').MongoClient;
var mongoClient = require('./mongoclient.js').mongoClient;
var collectionName = 'testMarkers';

var url = "mongodb://localhost:27017/myproject";
MongoClient.connect(url, function(err, db) {
  console.log("Connected correctly to server");
  findDocuments(db, function() {
    db.close();
  });
});

var findDocuments = function(db, callback) {
  var collection = db.collection('testMarkers');
  collection.find({}).toArray(function(err, docs) {
    if (err) throw err;
    console.dir(docs);
    callback(docs);
    db.close();
  });
  console.log("Found the following records123");
  return collection;
};

module.exports = {
  finder: findAll
};

function findAll(callback) {
  var values = [];
  mongoClient(function(err, db) {
  if (err) throw err;
  var collection = db.collection(collectionName)
    .find({})
    .toArray(function(err, docs) {
      if (err) throw err;
      callback(docs);
      db.close();
    });
});
return values;
}
