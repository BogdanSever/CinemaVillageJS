const express = require('express');
const { loginUser } = require('../database/dbController');
const jwt = require('jsonwebtoken');

const router = express.Router();

module.exports = (secretKey) => {
  // Route to log in a user
  router.post('/loginUser', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await loginUser(email, password);
      if (user) {
        // Create JWT token
        const token = jwt.sign({ email, role: user.role }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful!', token, email: user.email, role: user.role });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
