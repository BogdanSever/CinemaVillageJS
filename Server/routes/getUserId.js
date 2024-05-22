const express = require('express');
const router = express.Router();
const { getUserIdByEmail } = require('../database/dbController');

router.get('/getUserId/:email', async (req, res) => {
    const { email } = req.params;

    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const result = await getUserIdByEmail(email);

        if (result.success) {
            res.status(200).json({ id_user: result.id_user });
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
