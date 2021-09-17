const token = require('./auth/token');
const mongo = require('../db/mongoconnect');
var db;

mongo.then(function(connection) {
  db = connection.database;
})

/**
 * Refresh token implementation
 * - Object to store active refresh token
 */
var activeTokenDictionary = {};

module.exports = {
  generate_token,
  api_refresh_token
}

function generate_token(user) {
  const newToken = token.signJWT(user, token.ACCESS_TYPE);
  const newRefreshToken = token.signJWT(user, token.REFRESH_TYPE);

  activeTokenDictionary[newRefreshToken] = newToken;

  //console.log("Token book", activeTokenDictionary);

  return {
    "token": newToken,
    "refresh_token": newRefreshToken
  }
}

async function api_refresh_token(req, res) {
  try {
    if (req.body.refresh_token && activeTokenDictionary.hasOwnProperty(req.body.refresh_token)) {
      let checkRefreshToken = await token.verifyJWT(req.body.refresh_token, token.REFRESH_TYPE);

      const newToken = token.signJWT(checkRefreshToken.decoded.user, token.ACCESS_TYPE);
      const newRefreshToken = token.signJWT(checkRefreshToken.decoded.user, token.REFRESH_TYPE);

      delete activeTokenDictionary[req.body.refresh_token];
      activeTokenDictionary[newRefreshToken] = newToken;

      //console.log("Token book", activeTokenDictionary);

      res.json({
        status: "success",
        token: newToken,
        refresh_token: newRefreshToken
      })
    }
    else {
      throw {
        message : "Invalid token / token not found"
      } 
    }
  }
  catch(error) {
    const message = (error.message ? error.message : "Error authentication")
    res.json({
      status: "error",
      message: message
    })
  } 
}