const http = require('http');
const path = require("path");
const express = require('express')
const bodyParser = require("body-parser");
const { response } = require('express');
const app = express();
require("dotenv").config({ path: path.resolve(__dirname, '.env') })
process.stdin.setEncoding("utf8");

const httpSuccessStatus = 200;

app.set("views", path.resolve(__dirname, "templates"));
var listener = app.listen(8888, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});
app.set("view engine", "ejs");


app.get("/", (request, response) => {
	response.render("index")
  });
