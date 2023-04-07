const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/CityWeather", function(req,res){

  res.sendFile(__dirname + "/CityWeather.html");

});

app.get("/", function(req,res){

  res.sendFile(__dirname + "/index.html");

});

app.post("/CityWeather", function(req, res){

  console.log(req.body.cityName);
  const query = req.body.cityName;
  const apiKey = "711f62e772f7f1b72652548fe2d39348";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query +"&appid=" + apiKey + "&units=metric";
  https.get(url, function(response){
    console.log(response.statusCode);
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      console.log(temp);
      res.write("<p>The weather is currently " + weatherDescription + "<p>");
      res.write("<h1>The temperature in " + query + " is " + temp + " degree celsius</h1>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
});



app.listen(process.env.PORT || 3000, function(){
console.log("server is running on port 3000");

});
