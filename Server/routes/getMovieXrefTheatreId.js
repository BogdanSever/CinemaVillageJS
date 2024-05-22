const express = require('express');
const router = express.Router();
const { getMovieXrefTheatreId } = require('../database/dbController');

router.get('/getMovieXrefTheatreId/:id_movie/:id_theatre/:date', async (req, res) => {
    const { id_movie, id_theatre, date} = req.params;
    
    if (!id_movie || !id_theatre || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await getMovieXrefTheatreId(id_movie, id_theatre, date);

        if (result.success) {
            res.status(200).json({ id_movie_xref_theatre: result.id_movie_xref_theatre });
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
