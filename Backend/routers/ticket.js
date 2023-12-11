const express = require('express');

const Ticket = require('../models/Ticket');

const router = express.Router();

router.post('/post', (req, res, next) => {
  const movieId = req.body.movieId;
  const date = req.body.date;
  const seat = req.body.seat;

  if (!movieId || !date || !seat) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const ticket = new Ticket(movieId, date, seat);
  ticket.save();
  return res.status(201).json({ message: 'Ticket created successfully' });
});

router.get('/get', (req, res, next) => {
  const id = req.query.id;
  const date = req.query.date;

  console.log(id, date);
  Ticket.getAll(tickets => {
    if (tickets) {
      const matchingTicket = tickets.find(
        ticket => ticket[id] && ticket[id][date]
      );

      if (matchingTicket) {
        const seats = matchingTicket[id][date];
        return res.json(seats);
      } else {
        return res.json([]);
      }
    } else {
      return res.status(404).json({ message: 'an error occurred' });
    }
  });
});

module.exports = router;
