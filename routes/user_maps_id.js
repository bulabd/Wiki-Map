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
    let query1 = `SELECT * FROM maps WHERE owner_id = ${templateVars.id}`;
    let query2 = `SELECT * FROM users2 WHERE id = ${templateVars.id}`;
    db.query(query1)
      .then(data1 => {
        templateVars.maps = data1.rows;
        db.query(query2)
          .then(data2 => {
            templateVars.name = data2.rows[0].name;
            res.render("mapList", templateVars);
          });
      });
  });
  return router;
}
