const express = require('express');
const { reset } = require('nodemon');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      id: req.session.user_id
    };
    let query1 = `SELECT * FROM maps`;
    db.query(query1)
      .then(data1 => {
        templateVars.maps = data1.rows;
        console.log(templateVars.maps);
        res.render("allMaps", templateVars);
      });
  });

  return router;
}