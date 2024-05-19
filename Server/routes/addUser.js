const express = require('express');
const { addUser } = require('../database/dbController');
const jwt = require('jsonwebtoken');

const router = express.Router();

module.exports = (secretKey) => {
  // Route to add a user
  router.post('/addUser', async (req, res) => {
    const { family_name, given_name, email, password, role } = req.body;
    try {
      // Ensure addUser returns the necessary user information
      const user = await addUser({ family_name, given_name, email, password, role });

      // Create JWT token
      const token = jwt.sign({ email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });

      // Respond with success message
      res.status(201).json({ message: 'User added successfully', token, email: user.email, role: user.role });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
