const mongoClient = require('./mongoclient.js').mongoClient
const collectionName = 'testMarkers'

mongoClient((err, db) => {
  console.log("Connected correctly to server");
  findDocuments(db, () => {
    db.close();
  });
})

const findDocuments = (db, callback) => {
  const collection = db.collection(collectionName);
  collection.find({}).toArray((err, docs) => {
    if (err) throw err;
    console.dir(docs);
    callback(docs);
    db.close();
  });
  console.log("Found the following records123");
  return collection;
}

module.exports = {
  finder: findAll
}

function findAll(callback) {
  mongoClient((err, db) => {
    findDocuments(db, callback);
  });
}
