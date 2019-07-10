const { Command } = require('discord-utils');
const { getItemDisplayInfo } = require('../item');
const { User } = require('models');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'oncebag';
    this.aliases.push('ob');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const user = context.message.author;
  let items = await User.getItems(user.id);
  if(!items)
    return context.reply('❌  Your OnceBag is empty.');

  items = Object.keys(items)
    .map(code =>
    {
      let { name, value, cost } = getItemDisplayInfo(code);
      value = value !== 'legendary'?
        value[0].toUpperCase() + value.substr(1) :
        value.toUpperCase();

      const count = items[code];
      cost *= count;
      return { name, value, count, cost };
    })
    .sort((a, b) => a.cost - b.cost)
    .reduce((text, item) => 
    {
      let { name, value, count, cost } = item;
      return text
        + name.padEnd(30, ' ')
        + count.toString().padEnd(5, ' ')
        + value.padEnd(12, ' ')
        + cost
        + '\n';
    }, '');

  const header = '       Item                Amount  Value       Cost\n'
    + '————————————————————————————————————————————————————\n';
  items = '🎒 **Your OnceBag**' + '```ml\n' + header + items + '\n```';
  await user.send(items);
  context.reply('💬  Check my private message.');
}