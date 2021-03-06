// load .env data into process.env
require("dotenv").config();
const request = require('request-promise-native');

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// bodyparser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// cookie session
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['Hello there!']
}));

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const userMapsRoutes = require("./routes/user_maps_id");
const mapViewRoutes = require("./routes/mapView");
const editMapsRoutes = require("./routes/editMap");
const showAllMapsRoutes = require("./routes/showAllMaps");
const createMapsRoutes = require("./routes/createMaps");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above
app.use("/login", loginRoutes(db));
app.use("/register", registerRoutes(db));
app.use("/maps", userMapsRoutes(db));
app.use("/create", createMapsRoutes(db));
app.use("/maps/:id/edit", editMapsRoutes(db));
app.use("/maps/:id", mapViewRoutes(db));
app.use("/all_maps", showAllMapsRoutes(db));

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});

app.get('/logout', (req,res) => {
  req.session = null;
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`WikiMap app listening on port ${PORT}`);
});

