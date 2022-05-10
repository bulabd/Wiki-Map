const express = require('express');
const { reset } = require('nodemon');
const router  = express.Router();
const request = require('request-promise-native');

module.exports = (db) => {
  router.get("/", (req, res) => {
    // const templateVars = {
    //   id: req.session.user_id
    // };
    res.render("createMaps");
  });

  router.post("/", (req, res) => {
    const templateVars = {
      id: req.session.user_id
    };
    let { latitude, longitude } = 0;
    request('https://api.ipify.org?format=json', (error, response, body) => {
     request(`https://freegeoip.app/json/${JSON.parse(body).ip}`, (error, response, body) => {
        latitude =  JSON.parse(body).latitude;
        longitude =  JSON.parse(body).longitude;
        let values = [templateVars.id, req.body.title, latitude, longitude, req.body.description];
        let query = `INSERT INTO maps (owner_id, title, initial_lat, initial_long, description) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
        db.query(query, values)
        .then(data => {
          res.redirect(`/maps`);
          return data;
        });
      });
    })


    // .then( data => {
    //   let values = [templateVars.id, req.body.title, data.latitude, data.longitude, req.body.description];
    //   let query = `INSERT INTO maps (owner_id, title, initial_lat, initial_long, description) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
    //   db.query(query, values)
    //   .then(data => {
    //     res.redirect(`/maps/${data.row[0].id}/edit`);
    //   });
    //  }
    // )
  });

  return router;
}
