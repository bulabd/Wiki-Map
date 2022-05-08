const express = require('express');
const { reset } = require('nodemon');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("register");
  });

  router.post("/", (req, res) => {
    let values = [req.body.email, req.body.password];
    let query = `SELECT * FROM users2 WHERE email = $1 AND password = $2`;
    let result;
    db.query(query, values)
      .then(data => {
      result = data.rows;
      if (result.length === 0) {
        let values2 = [req.body.name, req.body.email, req.body.password];
        let query2 = `INSERT INTO users2 (name, email, password) VALUES ($1,$2,$3) RETURNING *`;
        db.query(query2, values2)
        .then(data2 => {
          res.redirect(`/users_maps/${data2.rows[0].id}`);
        })
      } else {
        res.send('Error email already taken');
      }
    })
  });

  return router;
}
