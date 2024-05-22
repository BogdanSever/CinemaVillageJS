const express = require('express');
const { getImageById } = require('../database/dbController'); // Adjust the path as needed

const router = express.Router();

router.get('/image/:id', async (req, res) => {
    const imageId = req.params.id;
    try {
        const hexData = await getImageById(imageId);
        if (hexData) {
            const buffer = Buffer.from(hexData, 'hex'); // Convert hexadecimal to binary
            res.setHeader('Content-Type', 'image/png'); // Adjust MIME type if necessary
            res.send(buffer);
        } else {S
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
