const { Command } = require('discord-utils');
const database = require('database');

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

  let result = await database.query(raw_parameters)
    .then(([ result ]) => result)
    .catch(({ message }) =>
    {
      context.send(`❌  ${message}`);
    });

  if(!result)
    return;

  result = JSON.stringify(result, null, 2);
  if(result.length > 2000)
  {
    const blocks = result.match(/(.|[\r\n]){1,1950}(\n|$)/g);
    for(const block of blocks)
      await context.chat('```json\n' + block + '\n```');
  }

  context.chat('```json\n' + result + '\n```');
}