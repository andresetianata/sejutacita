const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports = {
  signJWT,
  verifyJWT
}

function signJWT(userObject, durationInMinutes) {
  //token hanya bertahan selama 2 menit saja
  var token = jwt.sign({user: userObject , exp : Math.floor(Date.now() / 1000) + (durationInMinutes * 60)}, process.env.JWT_SECRET_KEY, {algorithm : 'HS384'});
  return token;
}

function verifyJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ["HS384"] }, function(error, decoded) {
      if (error) {
        reject({
          status: "error",
          error: error,
          message: "Error verifying token"
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
