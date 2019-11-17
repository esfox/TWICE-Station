const { Command } = require('discord-utils');
const { twicepedia, managers_role } = require('config/config');
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
  const managers = context.bot.guilds
    .get(twicepedia).roles.get(managers_role).members
    .map(({ id }) => id);

  const coins = await User.getTop10Coins(managers);
  if(coins.length === 0)
    return context.send('No one has coins yet.');

  const leaderboard = '💰 **TWICE**COINS Leaderboard\n'
    + '```css\n'
    + coins
      .filter(({ user_id }) => context.guild.member(user_id))
      .map(data =>
      ({
        user: context.guild.member(data.user_id).user,
        coins: data.coins
      }))
      .slice(0, 10)
      .reduce((table, { user, coins }, i) =>
        table + `#${i + 1}`.padEnd(5, ' ')
          + `${user.tag.padEnd(17, ' ')} `
          + `${coins.toLocaleString()}\n`, '')
    + '\n```';
  context.chat(leaderboard);
}
