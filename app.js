const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const {
  Client
} = require('pg');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

let query = "";
let weatherDescription = "";
let imageURL = "";
let temp = "";





app.get("/", function(req, res) {
  let today = new Date();
  let currentDay = today.getDay();
  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  let today_date = today.toLocaleDateString("en-us", options);
  res.render("index", {
    td: today_date
  });
});

app.get("/signup", function(req, res) {

  res.render("signup");
});

app.get("/CityWeather", function(req, res) {

  res.render("CityWeather", {
    cn: "",
    wd: "",
    tp: "",
    imgurl: ""
  });

});

app.post("/CityWeather", function(req, res) {

  console.log(req.body.cityName);
  let query = req.body.cityName;
  const apiKey = "711f62e772f7f1b72652548fe2d39348";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=metric";
  https.get(url, function(response) {
    console.log(response.statusCode);
    response.on("data", function(data) {
      let weatherData = JSON.parse(data);
      temp = weatherData.main.temp;
      weatherDescription = weatherData.weather[0].description;
      let icon = weatherData.weather[0].icon;
      imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      console.log(temp);
      res.render("CityWeather", {
        cn: query,
        wd: weatherDescription,
        tp: temp,
        imgurl: imageURL
      });
    });
  });
});

app.post("/signup", async (req, res) => {
  console.log(req.body.acnm);
  console.log(req.body.pwd);
  console.log(req.body.emad);

  let acc_name = req.body.acnm;
  let paswd = req.body.pwd;
  let emlads = req.body.emad;

  const client = new Client({
    user: 'mydb_ab3v_user',
    host: 'dpg-cgnng2ou9tun42st144g-a',
    database: 'mydb_ab3v',
    password: 'NszA3WUQwKvA9pA3Uu5cerIiylNL7Pkp',
    port: 5432,
    ssl: true
  });
  client.connect(function(err) {
    console.log(err);
  });

  const insertQuery = 'INSERT INTO "accountList"."accountList" (account_id, account_name, password, email) VALUES (3, $1, $2, $3)';

  // define the data to be inserted
  const data = [acc_name, paswd, emlads];

  // execute the insert query using the pool
  await client.query(insertQuery, data, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Successfully inserted ${res.rowCount} row(s)`);
    };
  });
  // release the pool to free up resources
  await client.end();


  console.log("succeed");

  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");

});
