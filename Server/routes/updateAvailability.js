const express = require('express');
const router = express.Router();
const { updateSeatAvailability } = require('../database/dbController');

router.post('/updateAvailability', async (req, res) => {
    const { id_movie, id_theatre, date, availabilityData } = req.body;

    if (!id_movie || !id_theatre || !date || !availabilityData) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await updateSeatAvailability(id_movie, id_theatre, date, availabilityData);

        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
