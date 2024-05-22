const express = require('express');
const router = express.Router();
const { createBooking } = require('../database/dbController');

router.post('/createBooking', async (req, res) => {
    const { id_user, id_movie_xref_theatre, seats_booked, booking_time } = req.body;

    if (!id_user || !id_movie_xref_theatre || !seats_booked || !booking_time) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await createBooking(id_user, id_movie_xref_theatre, seats_booked, booking_time);

        if (result.success) {
            res.status(201).json({ message: result.message });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
