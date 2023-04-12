import https from "https";
var result = {};

export function getWeather(cityName) {
  console.log(cityName);
  var query = cityName;
  const apiKey = "711f62e772f7f1b72652548fe2d39348";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=metric";

  return new Promise((resolve, reject) => {
    https.get(url, function(response) {
      console.log(response.statusCode);
      let rawData = "";
      response.on("data", function(chunk) {
        rawData += chunk;
      });
      response.on("end", function() {
        let weatherData = JSON.parse(rawData);
        let temp = weatherData.main.temp;
        let weatherDescription = weatherData.weather[0].description;
        let icon = weatherData.weather[0].icon;
        let imageURL =
          "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        console.log(temp);
        const result = {
          cn: query,
          wd: weatherDescription,
          tp: temp,
          imgurl: imageURL,
        };        
        resolve(result);
      });
    }).on("error", (e) => {
      reject(e);
    });
  });

  return result;
}
