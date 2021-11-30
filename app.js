var express = require("express");
var app = express();
var http = require("http");
const cors=require("cors");
const request = require("request");
app.use(cors());
app.get("/stopPoints", (req, res) => {
  request(
    "https://api.tfl.gov.uk/Line/northern/StopPoints",
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


app.listen(8080, (req, res) => {
  console.log("Server listening on port 8080");
});
