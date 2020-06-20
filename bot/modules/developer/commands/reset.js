const { Command } = require('discord-utils');
const { db } = require('api/database')

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'reset';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const { raw_parameters } = context;
  if(!raw_parameters)
    return context.send('❌  Reset what?');

  const result = await db.raw(`delete from ${raw_parameters}`)
    .catch(({ message }) => { context.send(`❌  ${message}`); });

  if(!result)
    return;

  context.send(`✅  ${raw_parameters[0].toUpperCase()
    + raw_parameters.substr(1)} has been reset.`);
}