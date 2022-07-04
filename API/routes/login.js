const express = require('express');
const db = require('../config/db');

const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

const router = express.Router();

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.query("SELECT * FROM users WHERE mail = $1", [email]);
        if (user.rows.length === 0) return res.status(401).json("Invalid Credentials");

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
        if (!validPassword) return res.status(401).json("Invalid password");

        const jwtToken = jwtGenerator(user.rows[0].id);
        return res.json({ jwtToken });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;