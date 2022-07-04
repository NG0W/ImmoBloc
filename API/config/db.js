// Initialize connection and return potential errors
const Pool = require('pg').Pool;

const db = new Pool({
    host: 'localhost',
    database: 'ImmoBloc',
    user: 'postgres',
    password: ' ',
    port: 5433,
});

db.connect(error => {
    if (error) console.log('Error DB : ', error.stack);
    else console.log('Database : OK')
});

module.exports = db;