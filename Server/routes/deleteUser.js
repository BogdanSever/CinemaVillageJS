const express = require('express');
const { deleteUser } = require('../database/dbController'); // Adjust the path as needed

const router = express.Router();

router.delete('/deleteUser/:id_user', async (req, res) => {
  const { id_user } = req.params;
  try {
    const result = await deleteUser(id_user);

    if (result.success) {
      res.status(200).json({ message: 'User and related entries deleted successfully' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
