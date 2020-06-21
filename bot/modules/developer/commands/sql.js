const { Command } = require('discord-utils');
const { db } = require('api/database')

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'sql';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const { raw_parameters } = context;
  if(!raw_parameters)
    return context.send('❌  What query?');

  let result = await db.raw(raw_parameters)
    .catch(({ message }) =>
    {
      context.send(`❌  ${message}`);
      return false;
    });

  if(result === false)
    return;

  if(!result || result.length === 0)
    return context.send('✅  Query successful');

  result = JSON.stringify(result, null, 2);
  if(result.length > 2000)
  {
    const blocks = result.match(/(.|[\r\n]){1,1950}(\}\,|$)/g);
    for(const block of blocks)
      await context.chat('```json\n' + block + '\n```');

    return;
  }

  context.chat('```json\n' + result + '\n```');
}