const express = require('express');
const router = express.Router();
require('dotenv').config();

// Endpoint Login Admin
// POST /api/auth/login
router.post('/login', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!password) {
        return res.status(400).json({ msg: 'Password diperlukan' });
    }

    if (password === adminPassword) {
        res.json({ 
            msg: 'Login berhasil',
            token: 'admin-access-granted' 
        });
    } else {
        res.status(401).json({ msg: 'Password salah' });
    }
});

module.exports = router;