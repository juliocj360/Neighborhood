const express = require('express');
const app = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log('listening on port ' + PORT)
});

app.use(express.static('public'));

app.get('/data', (req, res) => {
  res.json('AIzaSyBeebyFKwnlKpo_H5m6sEy-osyCnlXrexw')
});
