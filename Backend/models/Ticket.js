const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'ticket.json'
);

const getTicketFromFile = callback => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};

module.exports = class Ticket {
  constructor(movieId, date, seat) {
    this.movieId = movieId;
    this.date = date;
    this.seat = seat;
  }

  save() {
    getTicketFromFile(tickets => {
      const movieIndex = tickets.findIndex(movie => movie[this.movieId]);

      if (movieIndex === -1) {
        const date = { [this.date]: [...this.seat] };
        tickets.push({ [this.movieId]: date });
      } else {
        if (!tickets[movieIndex][this.movieId][this.date]) {
          tickets[movieIndex][this.movieId][this.date] = [...this.seat];
        } else {
          let valid = true;
          for (const s of this.seat) {
            if (tickets[movieIndex][this.movieId][this.date].includes(s)) {
              valid = false;
            }
          }
          if (valid) {
            tickets[movieIndex][this.movieId][this.date].push(...this.seat);
          } else {
            return;
          }
        }
      }

      fs.writeFile(p, JSON.stringify(tickets), err => {
        if (err) {
          console.error('ticket.json:', err);
        }
      });
    });
  }

  static getAll(callback) {
    getTicketFromFile(callback);
  }
};
