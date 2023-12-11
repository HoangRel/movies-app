const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const app = express();

const moviesRoutes = require('./routers/movie');
const ticketRoutes = require('./routers/ticket');
const authenticate = require('./utils/auth');
const errorController = require('./controllers/error');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Xác thực với token
app.use(authenticate);

// request
app.use('/api/movies', moviesRoutes);

app.use('/ticket', ticketRoutes);

// error
app.use(errorController.get404);

app.listen(8080);
