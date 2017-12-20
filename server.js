// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");

var session = require("express-session");

var flash = require('connect-flash');

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

var http = require('http').Server(app);
var io = require('socket.io')(http);


// Sets up the Express app to handle data parsing
app.use(bodyParser.json());

//Keep an eye on this - may need to be set to 'false'
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));

app.use(flash());

// Routes
// =============================================================
require("./controllers/html-routes.js")(app);
require("./controllers/live_chat.js")(io);
require("./controllers/new_chat.js")(io);

require("./controllers/aws-routes.js")(app);

// Syncing our sequelize models and then starting our Express app
// =============================================================
	http.listen(PORT, function() {
		console.log("App listening on PORT " + PORT);
	});
