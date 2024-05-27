const express = require('express');
const router = express.Router();
const Chef = require('../../models/Chef');

// Get all chefs
router.get('/landingPage/chefs', async (req, res) => {
    try {
        const chefs = await Chef.find();
        res.json(chefs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chefs' });
    }
});

// Get a single chef by ID
router.get('/landingPage/chefs/:id', async (req, res) => {
    try {
        const chef = await Chef.findById(req.params.id);
        if (!chef) {
            return res.status(404).json({ error: 'Chef not found' });
        }
        res.json(chef);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chef' });
    }
});

module.exports = router;
