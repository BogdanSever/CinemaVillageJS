const express = require('express');
const { getSeatAvailability } = require('../database/dbController');
const router = express.Router();

router.get('/availability/:movieId/:theaterId/:date', async (req, res) => {
    const { movieId, theaterId, date } = req.params;
    try {
        const availabilityData = await getSeatAvailability(movieId, theaterId, date);
        res.json(availabilityData);
    } catch (error) {
        console.error('Error fetching seat availability:', error);
        res.status(500).json({ error: 'Failed to fetch seat availability' });
    }
});

module.exports = router;
