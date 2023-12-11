let io;

module.exports = {
  until: httpServer => {
    io = require('socket.io')(httpServer);
    return io;
  },

  getIo: () => {
    if (!io) {
      throw new Error('socket.io not initialized');
    }

    return io;
  },
};
