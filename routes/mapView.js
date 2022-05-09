const express = require('express');
const { reset } = require('nodemon');
const router  = express.Router({ mergeParams: true });

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      id: req.session.user_id
    };
    if (templateVars.id != req.params.id) {
      res.redirect('/login')
    }
    let query1 = `SELECT * FROM maps WHERE id = ${req.params.id}`;
    // console.log(req.params, 'reqparams');
    db.query(query1)
      .then(data => {
        templateVars.map = {};
        templateVars.map.title = data.rows[0].title;
        templateVars.map.initial_lat = data.rows[0].initial_lat;
        templateVars.map.initial_long = data.rows[0].initial_long;
        templateVars.map.description = data.rows[0].description;
        // console.log(templateVars);
        let query2 = `SELECT * FROM markers WHERE map_id = ${req.params.id}`;
        db.query(query2)
        .then(data2 => {
          templateVars.markers = JSON.stringify(data2.rows);
          console.log(JSON.stringify(data.rows))
          console.log(templateVars.markers);
          res.render("mapView", templateVars);
        })
      });
  });

  return router;
}
