const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("login");
    let query = `SELECT * FROM users2`;
    console.log(query);
    db.query(query)
    .then(data => {
      const users = data.rows;
      console.log(users);
    })
  });

  router.post("/", (req, res) => {
    let query = `SELECT * FROM users2`;
    console.log(query);
    db.query(query)
    .then(data => {
      const users = data.rows;
      users.forEach(user => {
        if (user.email === req.body.email && user.password === req.body.password) {
          req.session.user_id = user.id;
          res.redirect('/user_maps');
        }
      });
    })
  });

  return router;
};
