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

  const itemCodes = Object.keys(items);
  const itemsPerList = 20;
  let total = 0;
  let totalCost = 0;

  const itemLists = itemCodes
    .map(code =>
    {
      let { name, value, cost } = getItemDisplayInfo(code);
      value = value !== 'legendary'?
        value[0].toUpperCase() + value.substr(1) :
        value.toUpperCase();

      const count = items[code];
      cost *= count;

      totalCost += cost;
      total += count;
      return { name, value, count, cost };
    })
    .sort((a, b) => a.cost - b.cost)
    .reduce((lists, item, i) => 
    {
      const listIndex = Math.floor(i / itemsPerList);
      if(!lists[listIndex])
        lists[listIndex] = [];

      const { name, value, count, cost } = item;
      const text = name.padEnd(30, ' ')
        + count.toString().padEnd(4, ' ')
        + value.padEnd(11, ' ')
        + cost.toString().padStart(5, ' ');

      lists[listIndex].push(text);
      return lists;
    }, [])
    .map((list, i, lists) => 
    {
      list = (i === 0? '🎒 **Your OnceBag**```ml\n'
        + '       Item                Amount  Value      Cost\n'
        + '——————————————————————————————————————————————————\n' :
          '```ml\n')
        + list.join('\n')
        + (i === lists.length - 1? 
          '\n——————————————————————————————————————————————————\n'
          + '                    Total'
          + total.toString().padStart(6, ' ')
          + totalCost.toString().padStart(19, ' ') : '')
        + '\n```';
        
      return list;
    });

  for(const itemList of itemLists)
    await user.send(itemList);

  context.reply('💬  Check my private message.');
}