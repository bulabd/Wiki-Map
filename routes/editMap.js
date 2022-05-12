const express = require('express');
const { reset } = require('nodemon');
const router  = express.Router({ mergeParams: true });

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      id: req.session.user_id,
      map_id: req.params.id
    };
    let query1 = `SELECT * FROM maps WHERE id = ${req.params.id}`;
    db.query(query1)
      .then(data => {
        if (templateVars.id !== data.rows[0].owner_id) {
          return res.redirect('/login');
        }
        templateVars.map = {};
        templateVars.map.title = data.rows[0].title;
        templateVars.map.initial_lat = data.rows[0].initial_lat;
        templateVars.map.initial_long = data.rows[0].initial_long;
        templateVars.map.description = data.rows[0].description;
        let query2 = `SELECT * FROM markers WHERE map_id = ${req.params.id}`;
        db.query(query2)
        .then(data2 => {
          templateVars.markers = JSON.stringify(data2.rows);
          res.render("editMap", templateVars);
        })
      });
  });

  router.post("/", (req, res) => {
    const { param } = req.query
    if (param === 'addMarker') {
      let values = [req.params.id, req.session.user_id ,req.body.title, req.body.description, req.body.image_url, req.body.latitude, req.body.longitude, req.body.type];
      let query = `INSERT INTO markers (map_id, owner_id, title, description, image_url, latitude, longitude, type)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
      db.query(query, values)
        .then(data => {
          res.redirect(`/maps/${req.params.id}/edit`);
          return data;
        });
    }
    if (param === "updateMarker") {
      let values = [req.params.id, req.body.title];
      let query = `UPDATE markers SET `;
      if (req.body.new_title) {
        query += `title = '${req.body.new_title}', `;
      }

      if (req.body.description) {
        query += `description = '${req.body.description}', `;
      }

      if (req.body.image_url) {
        if (req.body.image_url === "") {
          query += `image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiFdEPVQn9Hf_UkVTOco2_3_jHpfiR_jVYbA&usqp=CAU', `;
        } else {
          query += `image_url = '${req.body.image_url}', `;
        }
      }

      if (req.body.latitude) {
        query += `latitude = ${req.body.latitude}, `;
      }

      if (req.body.longitude) {
        query += `longitude = ${req.body.longitude}, `;
      }

      if (req.body.type) {
        query += `type = '${req.body.type}' `;
      }

      if (query[query.split('').length - 2] === ',') {
        query = query.split('');
        query = query.slice(0, query.length - 2);
        query = query.join('');
      }

      query += ` WHERE map_id = $1 AND title = $2;`;
      db.query(query, values)
        .then(data => {
          res.redirect(`/maps/${req.params.id}/edit`);
        });
    }
    if (param === 'deleteMarker') {
      let values = [req.params.id, req.body.id];
      let query = 'DELETE FROM markers WHERE map_id = $1 AND title = $2;';
      db.query(query, values)
        .then(data => {
          res.redirect(`/maps/${req.params.id}/edit`);
          return data;
        });
    }
    if (param === "deleteMap") {
      let values = [req.params.id];
      let query = 'DELETE FROM maps WHERE id = $1;';
      db.query(query, values)
        .then(data => {
          res.redirect('/maps');
          return data;
        });
    }
  });

  return router;
}
