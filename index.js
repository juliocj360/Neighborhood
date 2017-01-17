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

app.get('/map_api', (req, res) => {
  res.json(apiKey)
})
