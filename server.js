var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require('request');

// Require all database models
var db = require("./models");

// Set port to listen on
var PORT = 3000;

// Initialize Express
var app = express();

// Express-handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger("dev"));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

// Express static directory
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect("mongodb://localhost/nytscraper");
mongoose.connect("mongodb://heroku_n2d04qv4:11kbbp3d9n4umo439toi5lpdgt@ds159631.mlab.com:59631/heroku_n2d04qv4");
var db = mongoose.connection;

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytscraper";
// mongoose.Promise = Promise;
// mongoose.connect("mongodb://heroku_n2d04qv4:11kbbp3d9n4umo439toi5lpdgt@ds159631.mlab.com:59631/heroku_n2d04qv4");
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI, {
//   useMongoClient: true
// });

// Require our routes
require('./routes/routes.js')(app);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT);
});