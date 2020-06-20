const knex = require('knex');

const db = knex(
{
  client: 'sqlite3',
  connection: { filename: './api/database/twice-station.sqlite' },
  useNullAsDefault: true,
});

db.raw('select 1+1 as result')
  .then(() => console.log('Database connection ready.'))
  .catch(error =>
  {
    console.error('An error occurred with connecting to the database.');
    console.error(error);
  });

exports.db = db;
