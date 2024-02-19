const TicketList = require("./ticket-list");

class Sockets {
  constructor(io) {
    this.io = io;

    // Create a new instance of TicketList
    this.ticketList = new TicketList();

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", (socket) => {
      socket.on("request-ticket", (data, callback) => {
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
