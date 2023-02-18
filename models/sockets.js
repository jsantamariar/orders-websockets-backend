const TicketList = require("./ticket-list");

class Sockets {
  constructor(io) {
    this.io = io;

    // create the ticketList instance
    this.ticketList = new TicketList();

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", socket => {
      console.log("client connected");

      // Escuchar evento: mensaje-to-server
      socket.on("request-new-ticket", (data, callback) => {
        const newTicket = this.ticketList.createTicket();
        callback(newTicket);
      });

      socket.on("next-ticket-to-work", ({ agent, desktop }, callback) => {
        const ticketAssigned = this.ticketList.assignTicket(agent, desktop);
        callback(ticketAssigned);

        this.io.emit("ticket-assigned", this.ticketList.last13);
      });
    });
  }
}

module.exports = Sockets;
