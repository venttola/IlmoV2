"use strict";
import server from "../dist/server";
import http from "http";
var config = require("config");

var port = normalizePort(process.env.PORT || config.port);
server.app.set("port", port);

var httpServer = http.createServer(server.app);

httpServer.listen(port);
console.log("Listening port " + port);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}