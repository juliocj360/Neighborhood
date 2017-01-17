var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var mongoClient = require('./mongoclient.js').mongoClient;
var collectionName = 'testMarkers';

// Connection URL
var url = "mongodb://localhost:27017/myproject";
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
//  insertDocument(db, function() {
  //  updateDocument(db, function() {
    //  deleteDocument(db, function() {
        findDocuments(db, function() {
          db.close();
        });
    //  });
  //  });
//  });
});

var deleteCollection = function(db) {
  var collection = db.collection('testMarkers');
  db.dropDatabase(collection)
  console.log("testMarkers deleted");
  findDocuments(db, function() {
    db.close();
  });
}

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('testMarkers');
  // Insert some documents
  collection.insertMany([
    {
      name: "Benihana",
      pos: { lat: 33.666808, lng: -117.867134 },
      type: "restaurant",
      likes: 0
    },
    {
      name: "Jamba Juice",
      pos: { lat: 33.666772, lng: -117.864495},
      type: "restaurant",
      likes: 0
    },
    {
      name: "Bosscat Kitchen and Libations",
      pos: { lat: 33.670174, lng: -117.864999 },
      type: "restaurant",
      likes: 1
    },
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}

var insertDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('testMarkers');
  // Insert some documents
  collection.insertOne(
    {
      name: "OCCS",
      pos: { lat: 33.668674, lng: -117.863800 },
      type: "School",
      likes: 1
    }
  , function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Inserted OCCS into the document collection");
    callback(result);
  });
}

var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents1');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });
}

var deleteDocument = function(db, callback) {
  var objectBeni = ObjectId( "587d4af9c0fe485a8a82aedc" );
  // Get the documents collection
  var collection = db.collection('testMarkers');
  // Insert some documents
  collection.deleteOne({ "_id" : objectBeni }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field _id equal to 587d2b9205e0215581201fa3");
    callback(result);
  });
}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('testMarkers');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    if (err) throw err;
    assert.equal(err, null);
    console.dir(docs);
    callback(docs);
    db.close();
  });
  console.log("Found the following records123");
  return collection;
};

module.exports = {
  get: getItem,
  add: addItem,
  remove: removeItem,
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
