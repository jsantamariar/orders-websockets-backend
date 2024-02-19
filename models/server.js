// Servidor de Express
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const cors = require("cors");

const Sockets = require("./sockets");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // Http server
    this.server = http.createServer(this.app);

    // Socket config
    this.io = socketio(this.server, {
      /* config */
    });

    // Sockets Initialization
    this.sockets = new Sockets(this.io);
  }

  middlewares() {
    // Deploy in public folder
    this.app.use(express.static(path.resolve(__dirname, "../public")));

    // cors config
    this.app.use(cors());

    // Get last 13 tickets
    this.app.get("/lasts", (req, res) => {
      res.json({
        ok: true,
        last: this.sockets.ticketList.last13,
      });
    });
  }

  execute() {
    //  Middlewares Initialization
    this.middlewares();

    // Server Initialization
    this.server.listen(this.port, () => {
      console.log("Server running on port:", this.port);
    });
  }
}

module.exports = Server;
