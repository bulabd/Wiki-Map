const express = require('express');
const { reset } = require('nodemon');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      id: req.session.user_id
    };
    if (!templateVars.id) {
      res.redirect("/login");
      return;
    }
    let query1 = `SELECT * FROM maps WHERE id = ${templateVars.id}`;
    db.query(query1)
      .then(data1 => {
        templateVars.maps = data1.rows;
        res.render("mapList", templateVars);
      });
  });
  return router;
}
