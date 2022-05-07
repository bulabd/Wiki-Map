const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userID = req.session.user_id;
    if (userID != null) {
      res.redirect('/user_maps/:id');
    }
    const templateVars = {
      // user:  ID of user using query
    };
    res.render('login_ejs');
  });

  router.post("/", (req, res) => {
    const email = req.body.email;
    // const foundUser = findUserByEmail(email, users);
    if (foundUser) {
      if (foundUser.password) {
        req.session.user_id = foundUser.id;
        res.redirect('/user_maps/:id');
      } else {
        res.status(403);
        res.send('<h1>Wrong password</h1>');
      }
    } else {
      res.status(403);
      res.send('<h1>Could not find User</h1>');
    }
  });

  return router;
};
