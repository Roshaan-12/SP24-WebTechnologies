const express = require('express');
const router = express.Router();
const Chef = require('../../models/Chef');

// Get all chefs with pagination
router.get('/landingPage/chefs', async (req, res) => {
    try {
        const perPage = 3;  // Number of chefs per page
        const page = req.query.page ? parseInt(req.query.page) : 1;

        const [chefs, totalChefs] = await Promise.all([
            Chef.find()
                .skip((perPage * page) - perPage)
                .limit(perPage),
            Chef.countDocuments()
        ]);

        const totalPages = Math.ceil(totalChefs / perPage);

        res.render('chefs', {
            layout: "layouts/main",
            chefs,
            page,
            totalPages
        });
    } catch (error) {
        res.status(500).send('Failed to fetch chefs');
    }
});

module.exports = router;
