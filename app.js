import express from "express";
import https from "https";
import bodyParser from "body-parser";
import ejs from "ejs";
import _ from "lodash";
import pg from 'pg';
const {
  Client
} = pg;
import {
  getWeather
} from "./CityWeather.js";
import {
  signup
} from "./signup.js";
import {
  userlist
} from "./userlist.js";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

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
      res.redirect("/main");
    } else {
      res.redirect("/");
    }
    console.log("Delayed for 3 second.");
  }, 3000);

});

app.get("/signup", function(req, res) {
  res.render("signup");
});

app.get("/main", function(req, res) {
  res.render("main");
});


app.get("/CityWeather", function(req, res) {
  res.render("CityWeather", {
    cn: "",
    wd: "",
    tp: "",
    imgurl: ""
  });
});

app.get("/userList", function(req, res) {
  userlist()
    .then((result) => res.render("userList",{rs:result}))
    .catch((err) => console.error(err.message));
});

app.post("/CityWeather", function(req, res) {
  getWeather(req.body.cityName)
    .then((result) => {
      res.render("CityWeather", result);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.post("/signup", async (req, res) => {
  signup(req.body);
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");

});
