const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/",function(req,res){

  res.sendFile(__dirname+"/index.html");
})

app.post("/",function(req,res){

  const query = req.body.cityName;
  const unit = req.body.units;
  var unitName = getUnitName(unit);

  const apiKey = process.env.API_KEY;
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&units="+unit+"&appid="+apiKey;
  https.get(url,function(response){
     console.log(response.statusCode);
     response.on("data",function(data){

       const weatherData = JSON.parse(data);
       const temp = weatherData.main.temp;
       const feelsLikeTemp = weatherData.main.feels_like;
       const des = weatherData.weather[0].description;
       const icon = weatherData.weather[0].icon;
       const imgUrl = "http://openweathermap.org/img/wn/"+icon+"@2x.png";

       res.send("<br><h1>The temperature in "+query+" is "+temp+" degrees "+unitName+".</h1><br><h2>It feels like "+feelsLikeTemp+" and "+des+".</h2><img src="+imgUrl+">")
     })
  })
})

function getUnitName(unit){
  if(unit==="metric")
  {
    return "Celsius";
  }
  else if(unit==="standard")
  {
    return "Kelvin";
  }
  else if(unit==="imperial")
  {
    return "Fahrenheit";
  }
}


app.listen(3000,function(){
  console.log("Server is running at port 3000.")
})
