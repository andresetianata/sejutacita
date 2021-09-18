const token = require('./auth/token');
const mongo = require('../db/mongoconnect');
const redis = require('../db/redisconnect');
var db, redisClient;

mongo.then(function(connection) {
  db = connection.database;
})
redis.then(function(client) {
  redisClient = client;
})

/**
 * Refresh token implementation
 * - Object to store active refresh token
 */
var activeTokenDictionary = {};

module.exports = {
  generate_token,
  api_refresh_token,
  api_refresh_token_redis
}

function generate_token(user) {
  return new Promise(async (resolve, reject) => {
    const newToken = token.signJWT(user, token.ACCESS_TYPE);
    const newRefreshToken = token.signJWT(user, token.REFRESH_TYPE);
    try {
      await redisClient.set(newRefreshToken, newToken);
      resolve({
        status: "success",
        redis_status: "success",
        token: newToken,
        refresh_token: newRefreshToken
      })
    }
    catch(error) {
      //make it still resolve, because caching in redis is not that urgent
      resolve({
        status: "success",
        redis_status: "error",
        token: newToken,
        refresh_token: newRefreshToken
      })
    }
  });
  //activeTokenDictionary[newRefreshToken] = newToken;

  //console.log("Token book", activeTokenDictionary);
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
async function api_refresh_token_redis(req, res) {
  try {
    if (!req.body.refresh_token) throw { message : "Invalid token / token not found" }
    let isKeyExist = await redisClient.exists(req.body.refresh_token);
    console.log("Is token exist", isKeyExist);
    if (isKeyExist == 0) throw { message : "Invalid refresh token" }
    else {
      let checkRefreshToken = await token.verifyJWT(req.body.refresh_token, token.REFRESH_TYPE);

      const newToken = token.signJWT(checkRefreshToken.decoded.user, token.ACCESS_TYPE);
      const newRefreshToken = token.signJWT(checkRefreshToken.decoded.user, token.REFRESH_TYPE);
      redisClient.del(req.body.refresh_token);
      redisClient.set(newRefreshToken, newToken);

      res.json({
        status: "success",
        token: newToken,
        refresh_token: newRefreshToken
      })
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