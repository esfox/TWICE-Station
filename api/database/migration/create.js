const { db } = require('..');

(async () =>
{
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
})();
