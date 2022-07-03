const express = require('express');
const { db } = require('../config/db');

const router = express.Router();

// Get data
router.get('/', (request, response) => {
    db.query('SELECT * FROM users', (error, result) => {
        if (error) throw new Error('Error request');
        else response.status(200).json(result.rows);
    });
});

// Post data
router.post('/insert', (request, response) => {
    const { name, surname, age, address, id_status, id_agency } = request.body;

    db.query('INSERT INTO users (name, surname, age, address, id_status, id_agency) VALUES ($1, $2, $3, $4, $5, $6)', [name, surname, age, address, id_status, id_agency], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Fill all fields pls' });
        else response.status(201).json({ status: 'success', message: 'User successfully added' });
    });
});

// Edit data by ID
router.put('/edit/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const { name, surname, age, address, id_status, id_agency } = request.body;

    db.query('UPDATE users SET name = $1, surname = $2, mail = $3, address = $4, id_status = $5, id_agency = $6 WHERE id = $7', [name, surname, age, address, id_status, id_agency, id], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Bad insertion values' });
        else response.status(201).json({ status: 'success', message: 'User successfully edited' });
    });
});

// Delete data by ID
router.delete('/delete/:id', (request, response) => {
    const id = parseInt(request.params.id);

    db.query('DELETE FROM users WHERE id = $1', [id], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Unable to delete this' });
        else response.status(201).json({ status: 'success', message: 'User successfully deleted' });
    });
});

module.exports = router;