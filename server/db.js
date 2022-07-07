const Pool = require("pg").Pool;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "oui",
  port: 5432,
  database: "ImmoBloc",
});

module.exports = pool;
