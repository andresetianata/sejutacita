var mongo = require('../db/mongoconnect');
var db;

mongo.then(function(connection) {
  db = connection.database;
})

module.exports = {
  api_read_users_all,
  api_insert_user
}

function api_read_users_all(req, res) {
  if (db != null) {
    try {
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
      res.json({
        status: "error",
        message: "Error read"
      })
    }
  }
  else {
    res.json({
      status: "error",
      message: "fail to connect database"
    })
  }
}
function api_insert_user(req, res) {
  try {
    console.log("Body",req.body)
    var userObject = {
      "Name": req.body.name,
      "Role": req.body.role
    }
    db.collection("users").insertOne(userObject, function(err, result) {
      if (err) throw err;
      res.json({
        status: "success"
      })
    });
  }
  catch(error) {
    console.log("Error", error)
    res.json({
      status: "error",
      message: "Error insert"
    })
  }
}
