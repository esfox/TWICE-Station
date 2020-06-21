const { Command } = require('discord-utils');
const { Candybongs } = require('api/models');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'candybongs';
    this.aliases.push('cbs');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const candybongs = await Candybongs.ofUser(context.message.author.id);
  if(candybongs === undefined)
    return context.error("Whoops. Couldn't get your Candy Bongs. Please try again.");

  if(candybongs === 0)
    return context.reply("You don't have Candy Bongs.");
  context.reply(`🍭  You have ${candybongs} ${candybongs > 1?
    'Candy Bongs' : 'Candy Bong'}`);
}
