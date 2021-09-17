var mongo = require('../db/mongoconnect');
var token = require('./auth/token');
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
    let findUser = await db.collection("users").findOne({ "Username": req.body.username});
    if (!findUser) throw {
      message: "Invalid username/password"
    }
    let comparePassword = await bcrypt.compare(req.body.password, findUser.Password);
    if (comparePassword == true) {
      let generatedToken = token.signJWT(findUser, 120); //2 hours expiration
      res.json({
        status: "success",
        token: generatedToken,
        data: findUser
      })
    }
    else {
      throw {
        "message": "Invalid username/password"
      }
    }
  }
  catch(error) {
    var message = (error.message ? error.message : "Error Login");
    res.json({
      status: "error",
      message: message
    })
  }
}