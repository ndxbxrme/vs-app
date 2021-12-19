const express = require('express');
const path = require('path');
const port = process.env.PORT || 4010;
const app = express();

// serve static assets normally
app.use(express.static('./app'));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../app/index.html'));
});

app.listen(port);
console.log("server started on port " + port);