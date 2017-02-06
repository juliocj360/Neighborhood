const express = require('express');
const app = express();
const mongoTest = require('./app.js');
const bodyParser = require("body-parser");
const apiKey = process.env.MAP_API
const PORT = 3000;

app.listen(PORT, () => {
  console.log('listening on port ' + PORT)
});

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/markers', (req, res) => {
  mongoTest.finder((docs) => {
    res.json(docs);
  })
})

app.get('/users', (req, res) => {
  mongoTest.findUsers((docs) => {
    res.json(docs);
  })
})

app.get('/map_api', (req, res) => {
  res.json(apiKey)
})

app.post('/poster', (req, res) => {
  mongoTest.add(req.body, (doc) => {
    res.status(201).json(doc);
  })
})

app.post('/user', (req, res) => {
  mongoTest.userAdd(req.body, (doc) => {
    res.status(201).json(doc);
  })
})

app.post('/userupdate', (req, res) => {
  mongoTest.userUpdate(req.body, (doc) => {
    res.status(201).json(doc);
  })
})

app.delete('/deletemarkers', (req, res) => {
  mongoTest.delete((docs) => {
    res.json(docs)
  })
})
