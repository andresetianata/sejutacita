var mongo = require('../db/mongoconnect');
var token = require('./auth/token')
const bcrypt = require('bcrypt');
const saltRound = 10;

var db;

mongo.then(function(connection) {
  db = connection.database;
})

module.exports = {
  api_read_users_all,
  api_insert_user,
  api_read_user_by_id,
  api_update_user,
  api_delete_user
}

async function api_insert_user(req, res) {
  try {
    var userObject = {
      "Name": req.body.name,
      "Role": req.body.role,
      "Username": req.body.username,
      "Password": await bcrypt.hash(req.body.password, saltRound)
    }
    let insert = await db.collection("users").insertOne(userObject);
    //some error will be thrown to catch
    res.json({
      status: "success"
    })
  }
  catch(error) {
    var message = (error.message ? error.message : "Error insert");
    res.json({
      status: "error",
      message: message
    })
  }
}

async function api_read_users_all(req, res) {
  try {
    if (!req.headers.token) throw { message: "Invalid request"}
    let checkToken = await token.verifyJWT(req.headers.token);
    if (checkToken.decoded.Role != "Admin") {
      throw {
        message: "Permission denied."
      }
    }
    db.collection("users").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.json({
        status: "success",
        data: result
      });
    });
  }
  catch(error) {
    console.log("Error", error)
    var message = (error.message ? error.message : "Error read")
    res.json({
      status: "error",
      message: message
    })
  }
}
async function api_read_user_by_id(req, res) {
  try {
    if (!req.headers.token) throw { message: "Invalid request"}
    let checkToken = await token.verifyJWT(req.headers.token);
    if (checkToken.status == "success") {
      var findParams = {};
      if (checkToken.decoded.Role == "Admin") {
        findParams = {
          "_id": req.params.id
        };
      }
      else {
        if (req.params.id && req.params.id != checkToken.decoded._id) {
          throw {
            message : "Permission denied. Cannot read other user's profile"
          }
        }
        req.params.id = checkToken.decoded._id;
        findParams = {
          "_id": req.params.id
        }
      }

      db.collection("users").findOne(findParams).toArray(function(error, result) {
        if (error) throw { message: "Error read from database" }
        if (result.length == 0) throw { message: "User not found" }
        res.json({
          status: "success",
          data: result[0]
        })
      })
    }
  }
  catch(error) {
    var message = (error.message ? error.message : "Error read")
    res.json({
      status: "error",
      message: message
    })
  }
}
async function api_update_user(req, res) {
  try {
    if (!req.headers.token) throw { message: "Invalid request" }
    let checkToken = await token.verifyJWT(req.headers.token);
    if (checkToken.status == "success") {
      var queryUpdate = {
        "_id": req.body.id
      }
      var newValues = { $set: { } }
      if (checkToken.decoded.Role == "Admin") {
        if (req.body.username) newValues["$set"].Username = req.body.username;
        if (req.body.password) newValues["$set"].Password = req.body.password;
        if (req.body.name) newValues["$set"].Name = req.body.name;
      }
      else {
        if (req.body.id != checkToken.decoded._id) {
          throw {
            message : "Cannot update other user"
          }
        }
        else {
          if (req.body.username) newValues["$set"].Username = req.body.username;
          if (req.body.password) newValues["$set"].Password = req.body.password;
          if (req.body.name) newValues["$set"].Name = req.body.name;
        }
      }

      db.collection("users").updateOne(queryUpdate, newValues, function(error, result) {
        if (error) throw { message: "Error database" }
        res.json({
          status: "success"
        })
      })
    }
  }
  catch(error) {
    var message = (error.message ? error.message : "Error update")
    res.json({
      status: "error",
      message: message
    })
  }
}
async function api_delete_user(req, res) {
  try {
    if (!req.headers.token) throw { message: "Invalid request" };
    let checkToken = await token.verifyJWT(req.headers.token);
    if (checkToken.status == "success") {

      if (checkToken.decoded.Role == "Admin") {
        var queryDelete = {
          "_id": req.body.id
        }
        db.collection("users").deleteOne(queryDelete, function(error, result) {
          if (error) {
            throw {
              "message": "Error connect database"
            }
          }
          else {
            res.json({
              status: "success"
            })
          }
        });
      }
      else {
        throw {
          message : "Permission denied. Cannot delete user"
        }
      }
    }
  }
  catch(error) {
    var message = (error.message ? error.message : "Error delete");
    res.json({
      status: "error",
      message: message
    })
  }
}