(function() {
  var MongoClient, mongodb;
  mongodb = require('mongodb');
  MongoClient = mongodb.MongoClient;
  exports.mongoClient = function(callback) {
    MongoClient.connect('mongodb://localhost:27017/myproject', callback);
  };
}).call(this);
