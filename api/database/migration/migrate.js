const knex = require('knex');
const { db } = require('..');

const oldDB = knex(
{
  client: 'sqlite3',
  connection: { filename: './bot/data/database/data.sqlite' },
  useNullAsDefault: true,
});

(async () =>
{
  console.log('creating users table');
  await db.schema.createTable('users', table =>
  {
    table.increments('id');
    table.string('discord_id', 25);
    table.bigInteger('coins');
    table.integer('candybongs');
    table.text('items').defaultTo('{}');
    table.text('collections').defaultTo('[]');
    table.text('follows').defaultTo('[]');
    table.time('created_at').defaultTo(db.fn.now());
    table.time('updated_at');

    table.index('discord_id', 'discord_id');
  })
    .then(() => {});
  console.log('created users table');

  const users = await oldDB('users');
  const items = await oldDB('items');
  const follows = await oldDB('follows');
  const collections = await oldDB('collections');

  const data = users
    .map(user =>
    {
      const discordID = user.user_id;
      delete user.user_id;
      user.discord_id = discordID;

      const userItems = items.find(({ user_id }) => user.id === user_id);
      user.items = userItems ? userItems.items : '{}';

      const userCollections = collections.find(({ user_id }) => user.id === user_id);
      user.collections = userCollections ? userCollections.collections : '[]';

      const userFollows = follows.find(({ user_id }) => user.id === user_id);
      user.follows = userFollows ? userFollows.channels : '[]';

      user.created_at = new Date(user.created_at).getTime();
      user.updated_at = new Date(user.updated_at).getTime();
      return user;
    });
    
  const usersTable = db('users');
  await usersTable.truncate();
  
  for(const record of data)
  {
    console.log(`inserting user ${record.discord_id}`);
    await usersTable.insert(record);
  }

  console.log('Done');
})();
