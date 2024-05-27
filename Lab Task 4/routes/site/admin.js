const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Admin = require('../../models/Admin');

// GET route to render admin login form
router.get('/landingPage/admin', (req, res) => {
    const { error } = req.query; // Extract error message from query params
    res.render('adminSide/adminLogin', {layout: false, error: error ? 'Invalid credentials!' : '' });
});

// POST route for admin login
router.post('/landingPage/admin', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if admin exists
        const admin = await Admin.findOne({ username });
        if (admin) {
            // Compare the provided password with the hashed password in the database
            const match = await bcrypt.compare(password, admin.password);
            if (match) {
                // Passwords match, set session and redirect to admin dashboard
                req.session.adminId = admin._id;
                console.log('Session created:', req.session);
                res.redirect("/landingPage/admin/dashboard");
                console.log("I am being redirected");
            } else {
                // Passwords do not match, redirect to login page with error message
                res.redirect('/landingPage/admin?error=true');
            }
        } else {
            // Admin not found, redirect to login page with error message
            res.redirect('/landingPage/admin?error=true');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET route for admin logout
router.get('/landingPage/admin/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/landingPage/admin');
    });
});

// Admin register route
router.get('/landingPage/admin/register', (req, res) => {
    const { error } = req.query; // Extract error message from query params
    res.render('adminSide/adminRegister', {layout: false, error: error ? 'User already exists!' : '' });
});

// POST route for admin registration
router.post('/landingPage/admin/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            // Username already exists, redirect to registration page with error message
            res.redirect('/landingPage/admin/register?error=true');
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 8);

            // Create a new admin
            const newAdmin = new Admin({ username, password: hashedPassword });
            await newAdmin.save();

            res.redirect('/landingPage/admin');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
