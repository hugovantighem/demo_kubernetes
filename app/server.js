'use strict';

const express = require('express');
const fs = require('fs');
var os = require("os");
const pg = require('pg');
const connectionString = process.env.DATABASE_URL;
var  client = new pg.Client(connectionString);
setTimeout(function(){
  client.connect();
  var query = client.query(
    'CREATE TABLE IF NOT EXISTS items(name VARCHAR(40) not null)');
  query.on('end', () => { 
   console.log('TABLE created') 
//   client.end();
 });
}, 2000);

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
  var hostname = os.hostname();
  var date = new Date();
  console.log(hostname, 'received request', date);
  var file = '/data/message.txt';
  fs.appendFileSync(file,'[' + hostname + '] ' +  date.toString() + '\n');
  var content = fs.readFileSync(file, 'utf8');
  res.send(content);
});

app.get('/ready', (req, res) => {
  console.log('ready');
  res.send('OK');
});
app.get('/compute', (req, res) => {
  var cpt = 0;
  for (var i = 0; i < 1000000 ; i++){
    cpt += Math.sqrt(i);
  }
  res.send('OK ' + cpt);
});
app.post('/item', (req, res) => {
  console.log(req.body);
  const results = [];
  client.query('INSERT INTO items(name) values($1)',
     [req.body.name]
  );
  const query = client.query('SELECT name FROM items');
    // Stream results back one row at a time
    query.on('row', (row) => {
      console.log(row);
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      return res.json(results);
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
