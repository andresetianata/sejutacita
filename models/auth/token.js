const jwt = require('jsonwebtoken')
const {access_secret_key, refresh_secret_key} = require("./config");

const DURATION_TOKEN_SECONDS = 300; //5 minutes
const DURATION_REFRESH_TOKEN_SECONDS = 86400; //1 day
const ACCESS_TYPE = "access_token";
const REFRESH_TYPE = "refresh_token"

module.exports = {
  signJWT,
  verifyJWT,
  ACCESS_TYPE,
  REFRESH_TYPE
}

function signJWT(userObject, token_type) {
  var durationInSeconds, secret_key;
  if (token_type == REFRESH_TYPE) {
    durationInSeconds = DURATION_REFRESH_TOKEN_SECONDS;
    secret_key = refresh_secret_key;
  }
  else if (token_type == ACCESS_TYPE) {
    durationInSeconds = DURATION_TOKEN_SECONDS;
    secret_key = access_secret_key;
  }
  else return "No token";

  var token = jwt.sign({user: userObject , exp : Math.floor(Date.now() / 1000) + durationInSeconds}, secret_key, {algorithm : 'HS384'});
  return token;
}

function verifyJWT(token, token_type) {
  return new Promise((resolve, reject) => {
    var secret_key = "";
    if (token_type == REFRESH_TYPE) {
      secret_key = refresh_secret_key;
    }
    else if (token_type == ACCESS_TYPE) {
      secret_key = access_secret_key;
    }
    else {
      reject({
        status: "error",
        message: "Invalid token type"
      })
    }

    jwt.verify(token, secret_key, { algorithms: ["HS384"] }, function(error, decoded) {
      if (error) {
        reject({
          status: "error",
          message: error.name
        })
      }
      else {
        resolve({
          status: "success",
          decoded: decoded
        })
      }
    })
  })
}
