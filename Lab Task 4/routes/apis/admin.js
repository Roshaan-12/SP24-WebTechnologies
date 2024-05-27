const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Admin = require('../../models/Admin');
const authenticateToken = require('../../middlewares/authenticateToken');
require('dotenv').config();


router.get('/landingPage/admin', (req, res) => {
    const { error } = req.query; // Extract error message from query params
    res.render('adminSide/adminLogin', {layout: false, error: error ? 'Invalid credentials!' : '' });
});

// Apply token authentication middleware to all routes below
router.use(authenticateToken);

// Secret key used for signing the JWT
const secretKey = process.env.ACCESS_TOKEN_SECRET; // Ensure you have this set in your environment variables

/**
 * Function to generate a JWT for an admin user
 * @param {Object} admin - The admin user object (should include an identifier like _id)
 * @returns {String} - The generated JWT
 */
function generateAdminToken(admin) {
    // Payload to include in the JWT
    const payload = {
        _id: admin._id,
        role: 'admin',
        username: admin.username
    };

    // Options for the JWT
    const options = {
        expiresIn: '1h' // Token expiration time (e.g., 1 hour)
    };

    // Generate the JWT
    const token = jwt.sign(payload, secretKey, options);

    return token;
}

// Route for admin login
router.post('/landingPage/admin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (admin) {
            const match = await bcrypt.compare(password, admin.password);
            if (match) {
                const token = generateAdminToken(admin); // Use the token generation function
                return res.status(200).send({ message: "Login successful", token });
            } else {
                return res.status(400).send({ error: "Invalid credentials" });
            }
        } else {
            return res.status(400).send({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Internal server error' });
    }
});


// POST route for admin login
// router.post('/landingPage/admin', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const admin = await Admin.findOne({ username });
//         if (admin) {
//             const match = await bcrypt.compare(password, admin.password);
//             if (match) {
//                 const token = jwt.sign({ username: admin.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
//                 return res.status(200).send({ message: "Login successful", token });
//             } else {
//                 return res.status(400).send({ error: "Invalid credentials" });
//             }
//         } else {
//             return res.status(400).send({ error: "Invalid credentials" });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ message: 'Internal server error' });
//     }
// });

// POST route for admin registration
router.post('/landingPage/admin/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).send({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        const newAdmin = new Admin({ username, password: hashedPassword });
        await newAdmin.save();

        return res.status(201).send({ message: "Admin registered successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Internal server error' });
    }
});


module.exports = router;
