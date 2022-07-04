const express = require('express');
const db = require('../config/db');

const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

const router = express.Router();

// Get data
router.post("/register", async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const user = await db.query("SELECT * FROM users WHERE mail = $1", [email]);

        if (user.rows.length > 0) return res.status(401).send("User already exist!");

        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        let newUser = await db.query("INSERT INTO users (name, mail, password) VALUES ($1, $2, $3) RETURNING *", [name, email, bcryptPassword]);

        const jwtToken = jwtGenerator(newUser.rows[0].user_id);

        return res.json({ jwtToken });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;