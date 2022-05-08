const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userId = req.session.user_id
    if (userId) {
    return res.redirect("/user_maps/:id")
    }

  const templateVars =  { "sql": "querry" };
  res.render('register_ejs', templateVars)
  })




router.post("/", (req, res) => {
  const mail = req.body.email
  const pass = req.body.password
  if (!mail || !pass) {
    return res.send(400)
  }
  // const userId = generateRandomString()
  // const user = {id: userId, email: mail, password:  bcrypt.hashSync(pss, salt)}
  const findEmail = findUserEmail("sql")
  if ("sql") {
    return  res.send(400)
   }
   users[userId] = user
   const ID = userId
  req.session.user_id = ID
  res.redirect("/urls")
  })
}
