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
    this.port = process.env.URL;

    // Http server
    this.server = http.createServer(this.app);

    // Configuraciones de sockets
    this.io = socketio(this.server, {
      /* configuraciones */
    });

    this.sockets = new Sockets(this.io);
  }

  middlewares() {
    // Desplegar el directorio público
    this.app.use(express.static(path.resolve(__dirname, "../public")));

    // CORS
    this.app.use(cors());

    // GET last tickets
    this.app.get("/lasttickets", (req, res) => {
      res.json({
        status: 200,
        ok: true,
        lastTickets: this.sockets.ticketList.last13,
      });
    });
  }

  // Esta configuración se puede tener aquí o como propieda de clase
  // depende mucho de lo que necesites
  //   configureSockets() {
  //     new Sockets(this.io);
  //   }

  execute() {
    // Inicializar Middlewares
    this.middlewares();

    // Inicializar sockets
    // this.configureSockets();

    // Inicializar Server
    this.server.listen(this.port, () => {
      console.log("Server corriendo en puerto:", this.port);
    });
  }
}

module.exports = Server;
