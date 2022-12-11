const http = require('http');
const path = require("path");
const express = require('express')
const bodyParser = require("body-parser");
const { response } = require('express');
const app = express();
require("dotenv").config({ path: path.resolve(__dirname, '.env') })
process.stdin.setEncoding("utf8");

const port = 4000;
const httpSuccessStatus = 200;

app.set("views", path.resolve(__dirname, "templates"));
app.listen(port);
app.set("view engine", "ejs");


app.get("/", (request, response) => {
	response.render("index")
  });

console.log("Server running at localhost:" + port)