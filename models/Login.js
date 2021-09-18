const mongo = require('../db/mongoconnect');
const Authentication = require('./Authentication');
var db;
const bcrypt = require('bcrypt')

mongo.then(function(connection) {
  db = connection.database;
})

module.exports = {
  api_user_login
}

async function api_user_login(req, res) {
  try {
    let user = await db.collection("users").findOne({ "Username": req.body.username});
    if (!user) throw {
      message: "Invalid username/password"
    }
    let comparePassword = await bcrypt.compare(req.body.password, user.Password);
    if (comparePassword == true) {
      let generatedToken = Authentication.generate_token(user)
      res.json({
        status: "success",
        access_token: generatedToken.token,
        refresh_token: generatedToken.refresh_token,
        data: user
      })
    }
    else {
      throw {
        "message": "Invalid username/password"
      }
    }
  }
  catch(error) {
    console.log("Error", error)
    var message = (error.message ? error.message : "Error Login");
    res.json({
      status: "error",
      message: message
    })
  }
}