const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Get data
router.get('/', (request, response) => {
    db.query('SELECT * FROM users', (error, result) => {
        if (error) throw new Error('Error with the request');
        else response.status(200).json(result.rows);
    });
});

// Post data
router.post('/insert', (request, response) => {
    const { name, surname, mail, address, age, salary, contrat_type, id_agency } = request.body;
    console.log(name);
    db.query('INSERT INTO users (name, surname, mail, address, age, salary, contrat_type, id_agency) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [name, surname, mail, address, age, salary, contrat_type, id_agency], error => {
        if (error) response.status(400).json({ status: 'error', message: 'Fill all fields please sir' });
        else response.status(201).json({ status: 'success', message: 'User successfully added' });
    });
});

// Edit data by ID
router.put('/edit/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const { name, surname, mail, address, age, salary, contrat_type, id_agency } = request.body;

    db.query('UPDATE users SET name = $1, surname = $2, mail = $3, address = $4, age = $5, salary = $6, contrat_type = $7, id_agency = $8 WHERE id = $9', [name, surname, mail, address, age, salary, contrat_type, id_agency, id], error => {
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