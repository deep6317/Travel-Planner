var express = require("express");
var app = express();

var http = require("http");

const request = require("request");

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const axios = require("axios");

app.set("view engine", "ejs");
app.use("/assets", express.static("assets"));

app.get("/stopPoints", (req, res) => {
  request(
    `https://api.tfl.gov.uk/Line/${req.body.required_line}/StopPoints`,
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

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/find-trains", urlencodedParser, async (req, res) => {
  console.log(req.body);
  var arrivalData = {
    trains: [],
  };

  
    try {
      const stopPointResponse = await axios.get(
        "https://api.tfl.gov.uk/Line/northern/StopPoints"
      );
      for(const item of stopPointResponse.data) {
        //console.log(`https://api.tfl.gov.uk/Line/${req.body.required_line}/Arrivals/${body[i].id}?direction=${req.body.direction}`);
        console.log(item);
        if (
          item.commonName.includes(
            req.body.nearest_station
          )
        ) {
          var id = item.id;
          console.log(`https://api.tfl.gov.uk/Line/${req.body.required_line}/Arrivals/${id}?direction=${req.body.direction}`);
          const arrivalResponse = await axios.get(
            `https://api.tfl.gov.uk/Line/${req.body.required_line}/Arrivals/${id}?direction=${req.body.direction}`
          );
          for(train of arrivalResponse.data){
            //console.log(train);
            let date = new Date(train.expectedArrival);
            let departureDate = new Date(
              train.expectedArrival
            );
            departureDate.setMinutes(date.getMinutes() - req.body.time_to_walk);
            const formatAMPM = (date) => {
              let hours = date.getHours();
              let minutes = date.getMinutes();
              let ampm = hours >= 12 ? "pm" : "am";
              hours = hours % 12;
              hours = hours ? hours : 12;
              minutes = minutes.toString().padStart(2, "0");
              let strTime = hours + ":" + minutes + " " + ampm;
              return strTime;
            };
            console.log("Arrival Time: " + formatAMPM(date));
            console.log("Time to leave home: " + formatAMPM(departureDate));

            arrivalData.trains.push({
              towards: train.towards,
              stationName: train.stationName,
              platformName: train.platformName,
              destinationName: train.destinationName,
              lineName: train.lineName,
              direction: train.direction,
              currentLocation: train.currentLocation,
              expectedArrival: formatAMPM(date),
              timeToLeaveHome: formatAMPM(departureDate),
            });
            // console.log('Arrival Time: '+ date.getHours() + ' ' + date.getMinutes());
            // console.log('Time to leave home: '+ departureDate.getHours() + ' ' + departureDate.getMinutes());
          }
          
        }
        // console.log(body[i].commonName);
        //console.log(body[i].id);
        
      }
      res.render("result", { arrivalData: arrivalData });
    } catch (error) {
      console.log(error);
    }
  
});

app.listen(8080, (req, res) => {
  console.log("Server listening on port 8080");
});
