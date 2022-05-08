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

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above
app.use("/login", loginRoutes(db));
app.use("/register", registerRoutes(db));
// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/", (req, res) => {
  let values = [req.body.email, req.body.password]
  let query = `SELECT * FROM users2 WHERE email = $1 AND password = $2`;
  console.log(query);
  db.query(query, values)
  .then(data => {
    (data.rows).forEach(user => {
      if (values[0] === user.email) {
        return res.send('Email already taken')
      } else {
       let values2 = [req.body.name, req.body.email, req.body.password]
       let querry2 = `INSERT INTO users2 (name, email, password) VALUES ($1,$2,$3) RETURNING *`
       db.query(querry2, values2)
       .then(data2 => {
        return res.redirect(`/users_maps/${data2.id}`)
      })
      }
    })
  })
});

// router.post("/", (req, res) => {
//   let query = `SELECT * FROM users2`;
//   console.log(query);
//   db.query(query)
//   .then(data => {
//     const users = data.rows;
//     users.forEach(user => {
//       if (user.email === req.body.email && user.password === req.body.password) {
//         res.redirect(`/users_maps/${user.id}`);
//       }
//     });
//   })
// });

// return router;
// };

// app.get("/login", (req, res) => {
//   res.render("login");
//   let query = `SELECT * FROM users2`;
//   console.log(query);
//   db.query(query)
//   .then(data => {
//     const users = data.rows;
//     console.log(users);
//   })
// });

// app.post("/login", (req, res) => {
//   let query = `SELECT * FROM users2`;
//   console.log(query);
//   db.query(query)
//   .then(data => {
//     const users = data.rows;
//     users.forEach(user => {
//       if (user.email === req.body.email && user.password === req.body.password) {
//         res.redirect(`/users_maps/${user.id}`);
//       }
//     });
//   })
// });





app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
