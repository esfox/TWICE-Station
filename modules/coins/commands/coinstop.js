const { Command } = require('discord-utils');
const { User } = require('database');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'coinstop';
    this.aliases.push('ctop');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const coins = await User.getAllCoins();
  if(coins.length === 0)
    return context.send('No one has coins yet.');

  const leaderboard = '💰 **TWICE**COINS Leaderboard\n'
    + '```css\n'
    + coins
      .slice(0, 10)
      .sort((a, b) => b.coins - a.coins)
      .map(data =>
      ({
        user: context.guild.member(data.user_id).user,
        coins: data.coins
      }))
      .reduce((table, item, i) =>
        table + `#${i + 1}`.padEnd(5, ' ')
          + `${item.user.tag}`.padEnd(15, ' ')
          + `   ${item.coins.toLocaleString()}\n`, '')
    + '\n```';
  context.chat(leaderboard);
}
