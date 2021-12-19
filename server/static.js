const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const port = process.env.STATIC_PORT || 4022;
const sslPort = process.env.STATIC_SSL_PORT;
const app = express();

let server = null;
let sslServer = null;

server = http.createServer(app);
if(sslPort) {
  sslServer = https.createServer({
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')
  })
}

// serve static assets normally
app.use(express.static('./app'));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../app/index.html'));
});

server.listen(port);
console.log("server started on port " + port);
if(sslServer) {
  sslServer.listen(sslPort);
  console.log('ssl server started on port ' + sslPort);
}