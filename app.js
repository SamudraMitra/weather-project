//jshint esversion:6
const express=require("express");
const app=express();
const ejs = require("ejs");
const https=require("https");
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html")
})
app.listen(process.env.PORT || 3000,function(){
  console.log("Server started on port 3000");
})
app.set('view engine', 'ejs');
app.post("/",function(req,res){
  // console.log();
  const appid="b2e60813a81008cd315addd834b13e0d";
  const city=req.body.city;
  const unit="metric"
  const url="https://api.openweathermap.org/geo/1.0/direct?q="+ city+"&appid="+appid+"&units="+unit;
  https.get(url,function(response){
    // console.log(response.statusCode);
    // res.send(response.);
    response.on("data",function(data){
      var lat=((JSON.parse(data))[0]).lat;
      var lon=((JSON.parse(data))[0]).lon;
      const wurl="https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid=b2e60813a81008cd315addd834b13e0d&units=metric";
      https.get(wurl,function(response2){
        response2.on("data",function(data){
          var weather = JSON.parse(data).weather[0].description;
          var temp= JSON.parse(data).main.temp;
          var imagurl="http://openweathermap.org/img/wn/"+(JSON.parse(data).weather[0].icon)+"@2x.png";
          // res.write("<h1>The weather is "+ weather+"</h1>");
          // res.write("<h1>The temperature is"+temp+"</h1>");
          // res.write("<img src="+imagurl+">");
          res.render("result",{place: city,weather:weather,temp:temp,iu:imagurl})
        });
      })
    })
  });
});
