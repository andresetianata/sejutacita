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
    db.collection("users").findOne({ "Username": req.body.username}).toArray(async function(error, result) {
      if (error) throw {
        error: error,
        message: "Error calling database"
      }
      if (result.length == 0) throw {
        message: "Invalid username/password"
      }

      let comparePassword = await bcrypt.compare(req.body.password, result[0].Password);
      if (comparePassword == true) {
        let generatedToken = token.signJWT(result[0], 2); //2 minutes expiration
        res.json({
          status: "success",
          token: generatedToken,
          data: result[0]
        })
      }
      else {
        throw {
          "message": "Invalid username/password"
        }
      }
    })
  }
  catch(error) {
    var message = (error.message ? error.message : "Error Login");
    res.json({
      status: "error",
      message: message
    })
  }
}