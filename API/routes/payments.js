const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Get data
router.get('/', (request, response) => {
    db.query('SELECT * FROM payments', (error, result) => {
        if (error) throw new Error('Error with the request');
        else response.status(200).json(result.rows);
    });
});

// Post data
router.post('/insert', (request, response) => {
    const { name, value, due_date, id_user, id_asset, id_status } = request.body;

    db.query('INSERT INTO payments (name, value, id_status, id_asset, id_user, due_date) VALUES ($1, $2, $3, $4, $5, $6)', [name, value, due_date, id_user, id_asset, id_status], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Fill all fields please sir' });
        else response.status(201).json({ status: 'success', message: 'User successfully added' });
    });
});

// Edit data by ID
router.put('/edit/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const { name, value, due_date, id_user, id_asset, id_status } = request.body;

    db.query('UPDATE payments SET name = $1, value = $2, due_date = $3, id_user = $4, id_asset = $5, id_status = $6 WHERE id = $7', [name, value, due_date, id_user, id_asset, id_status, id], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Bad insertion values' });
        else response.status(201).json({ status: 'success', message: 'User successfully edited' });
    });
});

// Delete data by ID
router.delete('/delete/:id', (request, response) => {
    const id = parseInt(request.params.id);

    db.query('DELETE FROM payments WHERE id = $1', [id], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Unable to delete this' });
        else response.status(201).json({ status: 'success', message: 'User successfully deleted' });
    });
});

module.exports = router;