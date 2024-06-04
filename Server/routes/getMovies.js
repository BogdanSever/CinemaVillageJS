const express = require('express');
const { getMoviesByDate } = require('../database/dbController');

const router = express.Router();

router.get('/movies/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const movies = await getMoviesByDate(date);

    // Convert binary image data to base64
    const moviesWithBase64Images = movies.map(movie => {
      if (movie.image) {
        movie.image = Buffer.from(movie.image, 'binary').toString('base64');
      }
      return movie;
    });

    res.json(moviesWithBase64Images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
