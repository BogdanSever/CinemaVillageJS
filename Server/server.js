const express = require('express');
const cors = require('cors'); // Needed for frontend to be able to make requests to the server.
const bodyParser = require('body-parser');

// Routes for querying the DB:
const testRoutes = require('./routes/test');
const addUserRoutes = require('./routes/addUser');
const loginUserRoutes = require('./routes/loginUser');
const imageRoute = require('./routes/getImage');
const movieRoute = require('./routes/getMovies');
const getAvailabilityRoute = require('./routes/getAvailability');
const updateAvailabilityRoute = require('./routes/updateAvailability');
const createBookingRoute = require('./routes/createBooking');
const getUserIdRoute = require('./routes/getUserId');
const getMovieXrefTheatreId = require('./routes/getMovieXrefTheatreId');
const getReservationDetails = require('./routes/getReservations');
const deleteUser = require('./routes/deleteUser');

const app = express();
const port = 3000;

app.use(express.json());
// Configure CORS to allow requests from your frontend origin
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Your frontend URL
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true // Allow credentials (cookies)
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User defined routes:
app.use(testRoutes);
app.use(imageRoute);
app.use(movieRoute);
app.use(getAvailabilityRoute);
app.use(updateAvailabilityRoute);
app.use(addUserRoutes);
app.use(loginUserRoutes);
app.use(createBookingRoute);
app.use(getUserIdRoute);
app.use(getMovieXrefTheatreId);
app.use(getReservationDetails);
app.use(deleteUser);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
