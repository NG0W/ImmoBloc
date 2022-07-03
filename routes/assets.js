const express = require('express');
const { db } = require('../config/db');

const router = express.Router();

// Get data
router.get('/', (request, response) => {
    db.query('SELECT * FROM assets', (error, result) => {
        if (error) throw new Error('Error request');
        else response.status(200).json(result.rows);
    });
});

// Post data
router.post('/insert', (request, response) => {
    const { name, id_agency, id_status, value, max_refunds } = request.body;

    db.query('INSERT INTO assets (name, id_agency, id_status, value, max_refunds) VALUES ($1, $2, $3, $4, $5)', [name, id_agency, id_status, value, max_refunds], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Fill all fields pls' });
        else response.status(201).json({ status: 'success', message: 'User successfully added' });
    });
});

// Edit data by ID
router.put('/edit/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const { name, id_agency, id_status, value, max_refunds } = request.body;

    db.query('UPDATE assets SET name = $1, id_agency = $2, id_status = $3, value = $4, max_refunds = $5 WHERE id = $6', [name, id_agency, id_status, value, max_refunds, id], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Bad insertion values' });
        else response.status(201).json({ status: 'success', message: 'User successfully edited' });
    });
});

// Delete data by ID
router.delete('/delete/:id', (request, response) => {
    const id = parseInt(request.params.id);

    db.query('DELETE FROM assets WHERE id = $1', [id], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Unable to delete this' });
        else response.status(201).json({ status: 'success', message: 'User successfully deleted' });
    });
});

module.exports = router;