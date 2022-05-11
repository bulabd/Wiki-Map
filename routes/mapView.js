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
        templateVars.map = {};
        templateVars.map.id = data.rows[0].id
        templateVars.map.title = data.rows[0].title;
        templateVars.map.initial_lat = data.rows[0].initial_lat;
        templateVars.map.initial_long = data.rows[0].initial_long;
        templateVars.map.description = data.rows[0].description;
        templateVars.button = false;
        if (data.rows[0].owner_id === templateVars.id) {
          templateVars.button = true;
        }
        let query2 = `SELECT * FROM markers WHERE map_id = ${req.params.id}`;
        db.query(query2)
        .then(data2 => {
          templateVars.markers = JSON.stringify(data2.rows);
          //Here to render "star" logo appropriately if map is favourited when page is rendering
          db.query(`SELECT * from favourite_maps where map_id = ${templateVars.map.id} and client_id = ${templateVars.id}`).then(data => {
            if(data.rows[0]) {
              templateVars.map.isFavourite = true;
            } else {
              templateVars.map.isFavourite = false;
            }
            res.render("mapView", templateVars);
          });
        })
      });
  });

  router.post('/', (req, res) => {
    const id = req.originalUrl.split('/')[2];
    const user_id = req.session.user_id;

    // is this map favourited by the user already
    db.query(`SELECT * FROM favourite_maps where map_id = ${id} and client_id = ${user_id};`).then(data => {
      // if it is, we're going to delete that record (so we can unfavourite it)
      if(data.rows[0]) {
        db.query(`DELETE FROM favourite_maps where map_id = ${id} and client_id = ${user_id};`);
      } else {
        // otherwise, we're going to add a new record to favourite it. First we fetch all the map data
        db.query(`SELECT * FROM maps where id =${id};`).then(data => {
          const originalMap =  data.rows[0];
          console.log(originalMap);
          // once we get our map data, we can create a new favourite record using that data
          if(originalMap) {
            db.query(`INSERT INTO favourite_maps (owner_id, client_id, map_id) VALUES (${originalMap.owner_id}, ${user_id}, ${id});`);
          }
        })
      }
    });
    res.redirect('back');
  });

  // function updateMap(id, updatedMap) {
    // Need to update this to add a record to favourite-map table
    // db.query(`SELECT * FROM maps where id =${id}`).then(data => {
    //   const originalMap =  data.rows[0];
    //   if(originalMap) {
    //     const map = {...originalMap, ...updateMap};
    //   }
    // })
    // const originalMapIndex = mapsData.findIndex(map => map.id === id);
    // if(updatedMap.isFavourite) {
    //   updatedMap.isFavourite = updatedMap.isFavourite === 'false' ? false : true;
    // }
    // mapsData[originalMapIndex] = {...originalMap, ...updatedMap};

  //   console.log(originalMap)
  // }

  return router;
}
