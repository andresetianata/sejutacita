const express = require('express');
const app = express();
const apiRouter = require('./routers/api');
const port = 8002;
const http = require('http');

app.use(express.json());
app.use('/apis', apiRouter);
app.set("port", port);

// catch error and forward to error handler
app.use(function(req, res, next) {
  var err = new Error();
  err.status = 404;
  err.message = "Not Found"
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    status: "error",
    errorMessage: err.message || 'internal error'
  })
});

var server = http.createServer(app);
server.listen(port);
server.on("listening", onListening);
server.on("error", onError)


function onListening() {
  console.log("Listening on " + server.address().port)
}
function onError(error) {
  console.log("Error ", error)
}