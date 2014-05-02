"use strict";

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , appiumDir = process.env.APPIUM_HOME
  , spawn = require('child_process').spawn;

app.listen(8080);

function handler(req, res) {
  console.log(req.url);
  var file = req.url;
  if (file === "/") {
    file = "/index.html";
  }
  fs.readFile(__dirname + file,
  function (err, data) {
    if (err && err.message.indexOf("ENOENT") !== -1) {
      res.writeHead(404);
      return res.end("Not Found");
    }
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  var alreadyPublished = false;

    //this.proc.on("error", function (err) {
      //logger.error("Unable to spawn adb: " + err.message);
      //if (!this.alreadyExited) {
        //this.alreadyExited = true;
        //readyCb(new Error("Unable to start Android Debug Bridge: " +
          //err.message));
      //}
    //}.bind(this));
    //this.proc.stdout.on('data', this.outputStreamHandler.bind(this));
    //this.proc.stderr.on('data', this.errorStreamHandler.bind(this));
    //this.proc.on('exit', this.exitHandler.bind(this));

  var outputHandler = function (data) {
    var lines = data.toString().trim().split("\n");
    socket.emit('lines', lines);
  };

  socket.on('publish', function () {
    if (!alreadyPublished) {
      alreadyPublished = true;
      console.log("publishing...");
      var proc = spawn("ls", ['-la', '/Users/jlipps'], {cwd: appiumDir});
      proc.on("error", function (err) {
        socket.emit('lines', ["Error: " + err]);
        socket.emit('done');
      });
      proc.stdout.on('data', outputHandler);
      proc.stdout.on('exit', function () {
        socket.emit('done');
      });
      proc.stdout.on('close', function () {
        socket.emit('done');
      });
    } else {
      console.log("already published, can't go again");
    }
  });
});
