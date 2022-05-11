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
    let query3 = `SELECT * FROM favourite_maps WHERE client_id = ${templateVars.id}`;
    let query4 = `SELECT maps.id, maps.title, maps.description ,favourite_maps.id as mapyy, favourite_maps.owner_id, favourite_maps.client_id, favourite_maps.map_id FROM maps JOIN favourite_maps ON maps.id = map_id WHERE client_id = ${templateVars.id}`;
    db.query(query1)
      .then(data1 => {
        templateVars.maps = data1.rows;
        db.query(query2)
          .then(data2 => {
            templateVars.name = data2.rows[0].name;
            db.query(query3)
              .then(data3 => {
                templateVars.favouriteMaps = data3.rows;
                // console.log(templateVars.favouriteMaps);
                // console.log(templateVars.maps);
                db.query(query4)
                  .then(data4 => {
                    templateVars.favMaps = data4.rows;
                    // console.log(templateVars.favMaps);
                    res.render("mapList", templateVars);
                  });
              });
          });
      });
  });
  return router;
}
