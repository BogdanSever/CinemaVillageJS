const express = require('express');
const { addUser } = require('../database/dbController');

const router = express.Router();

router.post('/addUser', async (req, res) => {
  const { family_name, given_name, email, password, role } = req.body;
  try {
    const user = await addUser({ family_name, given_name, email, password, role });

    res.status(201).json({ message: 'User added successfully', email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
