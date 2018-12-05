'use strict';

const express = require('express');
const fs = require('fs');


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  var date = new Date();
  console.log('Received request', date);
  var file = '/data/message.txt';
  fs.appendFileSync(file, date.toString() + '\n');
  var content = fs.readFileSync(file, 'utf8');
  res.send(content);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
