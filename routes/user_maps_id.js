const express = require('express');
const { reset } = require('nodemon');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      id: req.session.user_id
    };
    let query = `SELECT * FROM users2 WHERE id = ${templateVars.id}`;
    db.query(query)
      .then(data => {
        res.render("user_maps", templateVars);
        return data.rows[0];
      });
  });

  return router;
}
