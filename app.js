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

app.post("/", function(req, res) {
  console.log(req.body.acnm);
  console.log(req.body.pwd);

  let acc_name = req.body.acnm;
  let paswd = req.body.pwd;
  var identify = false;

  const client = new Client({
    user: 'mydb_ab3v_user',
    host: 'dpg-cgnng2ou9tun42st144g-a.singapore-postgres.render.com',
    database: 'mydb_ab3v',
    password: 'NszA3WUQwKvA9pA3Uu5cerIiylNL7Pkp',
    port: 5432,
    ssl: true
  });

  client.connect(function(err) {
    console.log(err);
  });

  client.query(`SELECT EXISTS ( SELECT * FROM account WHERE name = $1 AND password = $2)`, [acc_name, paswd], (err, res) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("login success");
      identify = res.rows[0].exists;
      console.log(identify);
    };
  });

  setTimeout(() => {
    if (identify) {
      res.redirect("/CityWeather");
    } else {      
      res.redirect("/");
    }
    console.log("Delayed for 3 second.");
  }, 3000);


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
    host: 'dpg-cgnng2ou9tun42st144g-a.singapore-postgres.render.com',
    database: 'mydb_ab3v',
    password: 'NszA3WUQwKvA9pA3Uu5cerIiylNL7Pkp',
    port: 5432,
    ssl: true
  });

  client.connect(function(err) {
    console.log(err);
  });

  client.query(`INSERT INTO account (name, password, email) VALUES ($1, $2, $3)`, [acc_name, paswd, emlads], (err, res) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("insert success");
    };
  });

  // execute the insert query using the pool
  client.query(`SELECT * from account`, (err, res) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(res.rows);
    };
    client.end();
  });


  console.log("succeed");

  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");

});
