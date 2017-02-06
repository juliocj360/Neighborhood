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

const findUsers = (db, callback) => {
  const collection = db.collection('users');
  collection.find({}).toArray((err, docs) => {
    if (err) throw err;
    console.dir(docs);
    callback(docs);
    db.close();
  });
  console.log("Found the following users");
  return collection;
}

module.exports = {
  finder: findAll,
  delete: deleter,
  add: adder,
  userAdd: userAdder,
  findUsers: queryUsers,
  userUpdate: updater
}

function updater(object, callback) {
  const namer = object.name;
  const named = JSON.stringify(namer)
  const newMood = object.mood;
  const mooder = JSON.stringify(newMood)
  console.log('1')
  mongoClient((err, db) => {
    console.log('2')
    var collection = db.collection('users');
    collection.update(
      { name: namer }, object, (err, result) => {
      console.log(result);
      callback(result);
      db.close()
    })
  })
}

function userAdder(object, callback) {
  console.log('1')
  mongoClient((err, db) => {
    console.log('2')
    var collection = db.collection('users');
    collection.insertMany([object], (err, result) => {
      console.log("Inserted document into the document collection");
      callback(result);
      db.close()
    })
  })
}

function adder(object, callback) {
  console.log('1')
  mongoClient((err, db) => {
    console.log('2')
    var collection = db.collection('testMarkers');
    collection.insertMany([object], (err, result) => {
      console.log("Inserted document into the document collection");
      callback(result);
      db.close()
    })
  })
}

function deleter(callback) {
  mongoClient((err, db) => {
    var collection = db.collection('users');
    db.dropDatabase(collection)
    var collection2 = db.collection('testMarkers');
    db.dropDatabase(collection2)
    console.log("all deleted");
    findDocuments(db, callback)
  })
}

function queryUsers(callback) {
  mongoClient((err, db) => {
    findUsers(db, callback);
  });
}

function findAll(callback) {
  mongoClient((err, db) => {
    findDocuments(db, callback);
  });
}
