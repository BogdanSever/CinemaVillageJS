const express = require('express');
const { getReservationDetails } = require('../database/dbController');

const router = express.Router();

router.get('/reservations/:id_user', async (req, res) => {
  const { id_user } = req.params;
  try {
    const result = await getReservationDetails(id_user);

    if (result.success) {
      res.json(result.reservation_details);
    } else {
      res.status(404).json({ error: result.error });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
