const express = require('express');
const { reset } = require('nodemon');
const router  = express.Router();
const request = require('request-promise-native');

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      id: req.session.user_id
    };
    if (templateVars.id) {
      res.render("createMaps");
    } else {
      res.redirect("login");
    }
  });

  router.post("/", (req, res) => {
    const templateVars = {
      id: req.session.user_id
    };
    let { latitude, longitude } = 0;
    request('https://api.ipify.org?format=json', (error, response, body) => {
      if (error) {
        res.redirect('/create');
        alert('Something went wrong. Please try again.');
      } else {
        request(`https://freegeoip.app/json/${JSON.parse(body).ip}`, (error, response, body) => {
          if (error) {
            res.redirect('/create');
            alert('Something went wrong. Please try again.');
          } else {
            latitude =  JSON.parse(body).latitude;
            longitude =  JSON.parse(body).longitude;
            let values = [templateVars.id, req.body.title, latitude, longitude, req.body.description];
            let query = `INSERT INTO maps (owner_id, title, initial_lat, initial_long, description) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
            db.query(query, values)
            .then(data => {
              res.redirect(`/maps`);
              return data;
            });
          }
        });
      }
    })
  });
  return router;
}
