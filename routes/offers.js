const express = require('express');
const { db } = require('../config/db');

const router = express.Router();

// Get data
router.get('/', (request, response) => {
    db.query('SELECT * FROM offers', (error, result) => {
        if (error) throw new Error('Error request');
        else response.status(200).json(result.rows);
    });
});

// Post data
router.post('/insert', (request, response) => {
    const { id_user, id_asset, id_status, value } = request.body;

    db.query('INSERT INTO offers (id_user, id_asset, id_status, value) VALUES ($1, $2, $3, $4)', [id_user, id_asset, id_status, value], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Fill all fields pls' });
        else response.status(201).json({ status: 'success', message: 'User successfully added' });
    });
});

// Edit data by ID
router.put('/edit/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const { id_user, id_asset, id_status, value } = request.body;

    db.query('UPDATE offers SET id_user = $1, id_asset = $2, id_status = $3, value = $4 WHERE id = $5', [id_user, id_asset, id_status, value, id], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Bad insertion values' });
        else response.status(201).json({ status: 'success', message: 'User successfully edited' });
    });
});

// Delete data by ID
router.delete('/delete/:id', (request, response) => {
    const id = parseInt(request.params.id);

    db.query('DELETE FROM offers WHERE id = $1', [id], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Unable to delete this' });
        else response.status(201).json({ status: 'success', message: 'User successfully deleted' });
    });
});

module.exports = router;