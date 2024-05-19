const express = require('express');
const { getAllUsers } = require('../database/dbController');

const router = express.Router();

// Route to fetch all users
router.get('/test', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
