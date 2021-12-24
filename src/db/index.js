const pg = require("pg");

let client = new pg.Client({
  connectionString: process.env.DATABASE_URL || "",
  ssl: {
    rejectUnauthorized: false,
  },
});

let devConfig = new pg.Client({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE
});

process.env.NODE_ENV === "production" ? client = client : client = devConfig;

client
  .connect()
  .catch(e => console.log(`Error connecting to Postgres server:\n${e}`));

module.exports = client;
