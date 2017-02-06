const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

function connect() {
  exports.mongoClient = (callback) => {
    MongoClient.connect('mongodb://localhost:27017/myproject', callback);
  };
}

connect()
