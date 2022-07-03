const express = require('express');
const { db } = require('../config/db');

const router = express.Router();

// Get data
router.get('/', (request, response) => {
    db.query('SELECT * FROM agencies', (error, result) => {
        if (error) throw new Error('Error request');
        else response.status(200).json(result.rows);
    });
});

// Post data
router.post('/insert', (request, response) => {
    const { name, code } = request.body;

    db.query('INSERT INTO agencies (name, code) VALUES ($1, $2)', [name, code], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Fill all fields pls' });
        else response.status(201).json({ status: 'success', message: 'User successfully added' });
    });
});

// Edit data by ID
router.put('/edit/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const { name, code } = request.body;

    db.query('UPDATE agencies SET name = $1, code = $2 WHERE id = $3', [name, code, id], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Bad insertion values' });
        else response.status(201).json({ status: 'success', message: 'User successfully edited' });
    });
});

// Delete data by ID
router.delete('/delete/:id', (request, response) => {
    const id = parseInt(request.params.id);

    db.query('DELETE FROM agencies WHERE id = $1', [id], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Unable to delete this' });
        else response.status(201).json({ status: 'success', message: 'User successfully deleted' });
    });
});

module.exports = router;