const express = require('express');
const { db } = require('../config/db');

const router = express.Router();

// Get data
router.get('/', (request, response) => {
    db.query('SELECT * FROM payments', (error, result) => {
        if (error) throw new Error('Error request');
        else response.status(200).json(result.rows);
    });
});

// Post data
router.post('/insert', (request, response) => {
    const { name, id_status, id_asset, id_user, value, due_date } = request.body;

    db.query('INSERT INTO payments (name, id_status, id_asset, id_user, value, due_date) VALUES ($1, $2, $3, $4, $5, $6)', [name, id_status, id_asset, id_user, value, due_date], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Fill all fields pls' });
        else response.status(201).json({ status: 'success', message: 'User successfully added' });
    });
});

// Edit data by ID
router.put('/edit/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const { name, id_status, id_asset, id_user, value, due_date } = request.body;

    db.query('UPDATE payments SET name = $1, id_status = $2, id_asset = $3, id_user = $4, value = $5, due_date = $6 WHERE id = $7', [name, id_status, id_asset, id_user, value, due_date, id], error => {
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