// Initialize connection and return potential errors

const { pg } = require('pg');

const db = new pg({
    host : 'localhost',
    port : 5432,
    user : 'postgres',
    database : 'ImmoBloc',
    password : ' '
});

db.connect(error => {
    if (error) console.log('Error DB : ', error.stack);
    else console.log('Database : OK')
});

module.exports = { db };