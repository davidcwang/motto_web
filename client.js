const axios = require('axios');
const express = require('express');
const app = express();
const formidable = require('formidable');
const fs = require('fs');


const hostname = 'localhost';
const port = 3000;
const serverPort = 8080;
const serverBaseUrl = `http://${hostname}:${serverPort}`;

const server = app.listen(port, function() {
    console.log(`Client server listening at ${hostname}:${port}`);
});


app.use('/', express.static(__dirname + '/public'));

app.post('/submit', (req, res) => {
  const form = formidable({multiples: true});

  form.parse(req, async (err, fields, result) => {
    const file = result.file;

    fs.readFile(file.path, 'utf8', async (err, data) => {
      if (err) {
        return console.log(err);
      }

      try {
        // Post file data to Flask server
        const response = await axios.post(`${serverBaseUrl}/upload`, {data});
        console.log('success');
        res.send(response.data);
      } catch (e) {
        res.send('upload failed');
        return console.error(e);
      }
    });
  });
});

/*
 * Promisify function so that we can use async/await on it.
 * Might be handy later.
 */
// promisify(f, true) to get array of results
function promisify(f, manyArgs = false) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      function callback(err, ...results) { // our custom callback for f
        if (err) {
          reject(err);
        } else {
          // resolve with all callback results if manyArgs is specified
          resolve(manyArgs ? results : results[0]);
        }
      }

      args.push(callback);

      f.call(this, ...args);
    });
  };
};