const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
// const validInfo = require("../middleware/validInfo");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");

//authorizeentication

router.post("/register", async (req, res) => {

  const { name, surname, email, address, age, salary, contrat_type, id_agency, password, wallet} = req.body;
  console.log("wallet : ", wallet)
  try {
    const user = await pool.query("SELECT * FROM users WHERE mail = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).send("User already exist!");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      "INSERT INTO users (name, surname, mail, address, age, salary, contrat_type, id_agency,pwd, wallet) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [name, surname, email, address, age, salary, contrat_type, id_agency,bcryptPassword, wallet]
    );

    const jwtToken = jwtGenerator(newUser.rows[0].id);
    console.log("???____")
    return res.json({ jwtToken });
    // res.json(newUser.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credentials");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );
    console.log(validPassword);
    if (!validPassword) {
      return res.status(401).json("Invalid password");
    }

    const jwtToken = jwtGenerator(user.rows[0].user_id);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/is-verify", authorization, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
router.post("/add_asset", async (req, res) => {

  const { name, address, type, id_agence, id_status, value, max_refunds } = req.body;
  console.log(name)
  try {
    const user = await pool.query("SELECT * FROM assets WHERE address = $1", [
      address,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).send("User already exist!");
    }

    let newAsset = await pool.query(
      "INSERT INTO assets (id, name, address, type, id_agency, id_status, value, max_refunds ) VALUES (12, $1, $2, $3, $4, $5, $6, $7)",
      [name, address, type, id_agence, id_status, value, max_refunds ]
    );
    console.log(newAsset)
    return ("added");
    // res.json(newUser.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/*
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNTU0MjJkOTQtNWZjYS00MDhhLWJhNTYtYjE3MDE5M2E2MzU3In0sImlhdCI6MTY1Njc2MDEwNiwiZXhwIjoxNjU2NzYzNzA2fQ.QDRMbuidWp1Qc7Ds-UeSunxA9k2_Z0NZA2KMq5ZhKYk
*/

module.exports = router;
