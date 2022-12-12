const http = require('http');
const path = require("path");
const express = require('express')
const bodyParser = require("body-parser");
const { response } = require('express');
const app = express();
const mod = require("./modules/getRankings")

require("dotenv").config({ path: path.resolve(__dirname, '.env') })
process.stdin.setEncoding("utf8");
let PGA_RANKINGS = []
const httpSuccessStatus = 200;


app.use('/static', express.static('static'))

app.set("views", path.resolve(__dirname, "templates"));
var listener = app.listen(4000, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});
app.set("view engine", "ejs");


app.get("/", (request, response) => {
 
	response.render("index")
  });

app.get("/rankings", (request,response) => {
  mod.getRankingsProm().then((res) =>  {
    const variables = {
      table : mod.makeRankingsTable(res),
      date: Date()
    };
    response.render("rankings.ejs",variables)
  
  
  
  });
  
  
});
