const http = require('http');
const path = require("path");
const express = require('express')
const bodyParser = require("body-parser");
const { response } = require('express');
const app = express();
const mod = require("./modules/getRankings");
const tournaments = require("./modules/getTourneys");


let foundTournaments = false
let playerTourneys = {}

require("dotenv").config({ path: path.resolve(__dirname, '.env') })
process.stdin.setEncoding("utf8");
let PGA_RANKINGS = []
const httpSuccessStatus = 200;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/static', express.static('static'))

app.set("views", path.resolve(__dirname, "templates"));
var listener = app.listen(4000, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});
app.set("view engine", "ejs");


app.get("/", (request, response) => {

  //Noting upcoming tournamens for players
  if (!foundTournaments) {
    let tourneys = {
      "mcilroy":[],
      "thomas":[],
      "scheffler":[],
      "zalatoris":[],
      "smith":[],
      "rahm":[],
      "spieth":[],
      "young":[]

    };
    tournaments.getUpcomingTournaments(tourneys,372).then((res) => {
      return tournaments.getUpcomingTournaments(res,373);
    }).then((res) => {return tournaments.getUpcomingTournaments(res,377)}).then((res) => {
      return tournaments.getUpcomingTournaments(res, 379)
    }).then((res)=>{
      playerTourneys = res;
      console.log(res)});
    foundTournaments = true



  }
 
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

app.get("/selectFavorites", (request, response) => {
  response.render("favorites.ejs")
});

app.post("/favorites", (request, response) => {
  let {favPlayer} = request.body;

  console.log(favPlayer);
  response.render("index")
});
