const { Command } = require('discord-utils');
const items = require('data/items');

let totalChances = 0;
const chances = '```ml\n'
  + items.reverse().map(({ value, chance }, i) =>
  {
    const previous = items[i - 1];
    chance = !previous? chance : chance - previous.chance;
    totalChances += chance;
    return (value[0].toUpperCase() + value.substr(1)).padEnd(10, ' ')
      + `= ${chance}%`;
  })
    .concat(`${'Trash'.padEnd(10, ' ')}= ${100 - totalChances}%`)
    .reverse().join('\n')
  + '\n```';

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'chances';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  context.send('📊  Item Value Chances', chances);
}
