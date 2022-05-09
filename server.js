// load .env data into process.env
require("dotenv").config();

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

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above
app.use("/login", loginRoutes(db));
app.use("/register", registerRoutes(db));
app.use("/maps", userMapsRoutes(db));

// /maps list of all maps
// /map/:id -> gets the data
// /map/:id/view -> shows one map
// /map/:id/edit -> edits map
// /user/maps -> maps the user created!
// /user/ -> user profile

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});

const mapsData = [
  {id: 'testId', owner_id: 'owner_id', title: 'Coldfoot, Alaska', initial_lat: 67.252174,
  isFavourite: false, initial_long: -150.174713, description: 'Is there apple pie'},
  {id: 'testId2', owner_id: 'owner_id', title: 'Map', initial_lat: 43.6487,
  isFavourite: false, initial_long: 79.38544, description: 'Where am I???'},
  {
    id: 'testId1',
    owner_id: 'owner_id',
    title: 'Super awesome map',
    initial_lat: 43.6487,
    initial_long: -79.38544,
    isFavourite: false,
    description: 'Toronto !!'
  }
]

// app.get("/maps", (req, res) => {
//   const templateVars = {
//     maps: mapsData
//   };
//   console.log(templateVars);
//   res.render("mapList", templateVars);
// });

app.get("/map/:id/view", (req, res) => {
  const id = req.originalUrl.split('/')[2];
  const map = getMap(id);
  const templateVars = {
    map
  };
  res.render("mapView", templateVars);
});

app.get("/map/:id/edit", (req, res) => {
  const id = req.originalUrl.split('/')[2];
  const map = getMap(id);
  const templateVars = {
    map
  };
  res.render("mapEdit", templateVars);
});


app.post('/map/:id/update', (req, res) => {
  const id = req.originalUrl.split('/')[2];
  const { body } = req;
  updateMap(id, body);
  res.redirect('back');
});

app.get('/map/:id', (req, res) => {
  // getting ID from url
  const id = req.originalUrl.split('/')[2];

  const map = getMap(id);
  // sending map data to client
  res.send({map})
});

//---------------"Helper" functions to go below. To be moved to a seperate helper.js file after refactoring.----------------------------------------------------------

function getMap(id)  {
  // finding map from mapData -> this needs to be updated to search in DB
 return mapsData.find(map => map.id === id);
}

function updateMap(id, updatedMap) {
  // updateing map in mapData -> this needs to be updated to update in DB
  const originalMap = getMap(id);
  const originalMapIndex = mapsData.findIndex(map => map.id === id);
  if(updatedMap.isFavourite) {
    updatedMap.isFavourite = updatedMap.isFavourite === 'false' ? false : true;
  }
  mapsData[originalMapIndex] = {...originalMap, ...updatedMap};
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

