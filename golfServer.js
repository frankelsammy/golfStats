const http = require('http');
process.stdin.setEncoding("utf8");
const path = require("path");
const express = require('express')
const bodyParser = require("body-parser");
const { response } = require('express');
const app = express();
const mod = require("./modules/getRankings");
const tournaments = require("./modules/getTourneys");
let foundTournaments = false
let playerTourneys = {}
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({ path: path.resolve(__dirname, '.env') })

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;

const database = { db: "CMSC335DB", collection: "golfers" };
const uri = `mongodb+srv://${userName}:${password}@cluster0.zbfrr36.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


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
      foundTournaments = true
      }).then(() => response.render("index"))
  } else {
    response.render("index")
  }
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
  async function addGolfers(golfers) {
    
    try {
      await client.connect();
      
      await insertGolfers(client, database, golfers);

    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }

  }
  let golfers = [];
  favPlayer.forEach((name) => {
    let golfer = {
      lastName: name.toUpperCase(),
      tourneys: playerTourneys[name] ?? ['NONE']
    };
    golfers.push(golfer);

  })
    
  addGolfers(golfers);
  const variables = {
    added: makeList(golfers)
    
  };

  response.render("processFavorites.ejs",variables);
});

app.get("/reset", (request, response) => {

  deleteAll();
  response.render("processRemove.ejs")

});

app.get("/favorites", (request,response) => {
  async function getEvents() {
  let golfers = await retrieveAll()
  const variables = {
    table: makeFavoritesTable(golfers),
    date: Date()
  };
  response.render("upcoming.ejs",variables);


  }
  getEvents();




});

async function insertGolfers(client, databaseAndCollection, golfers) {
  const result = await client.db(databaseAndCollection.db)
                      .collection(databaseAndCollection.collection)
                      .insertMany(golfers);

  console.log(`Inserted ${result.insertedCount} golfers`);
}

function makeList(golfers) {
  let res ="<ul>"
  golfers.forEach((golfer) => {
    res+= `<li>${golfer.lastName}</li>`
  });
  res += "</ul>";
  return res;
}
async function deleteAll() {
  
  try {
      await client.connect();
      const result = await client.db(database.db)
      .collection(database.collection)
      .deleteMany({});
      console.log(`Deleted documents ${result.deletedCount}`);
  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}

async function retrieveAll() {
  try {
      await client.connect();
      let filter = {};
      const cursor = client.db(database.db)
      .collection(database.collection)
      .find(filter);
      
      return await cursor.toArray();
      
  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}

function makeFavoritesTable(golfers) {
  let res = "<table border='1'>";
  res+= "<tr><th>Golfer</th><th>Upcoming Events</th>";
  golfers.forEach((golfer) => {
    res += `<tr><td>${golfer.lastName}</td><td>${golfer.tourneys.join(",")}</td></tr>`
  });
  res+="</table>";
  return res;
}