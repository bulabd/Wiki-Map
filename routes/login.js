const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("login");
    let query = `SELECT * FROM users2`;
    db.query(query)
    .then(data => {
      const users = data.rows;
    })
  });

  router.post("/", (req, res) => {
    let query = `SELECT * FROM users2`;
    db.query(query)
    .then(data => {
      const users = data.rows;
      users.forEach(user => {
        if (user.email === req.body.email && user.password === req.body.password) {
          req.session.user_id = user.id;
          res.redirect('/maps');
        }
      });
    })
  });

  return router;
};
