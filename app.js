var express = require('express');
var app = express();

var http = require('http');

const request = require('request');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.get('/stopPoints', (req, res) => {
  request(
    'https://api.tfl.gov.uk/Line/northern/StopPoints',
    { json: true },
    (err, response, body) => {
      if (err) {
        return console.log(err);
      }
      console.log(body);
      res.send(body);
    }
  );
  
});

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/find-trains', urlencodedParser, (req, res)=>{
  console.log(req.body);
  res.render('index');
});


app.listen(8080, (req, res) => {
  console.log("Server listening on port 8080");
});
