const express = require('express');
const { loginUser } = require('../database/dbController');
const router = express.Router();

router.post('/loginUser', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    if (user) {
      res.status(200).json({ message: 'Login successful!', email: user.email, role: user.role });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
