const { Command } = require('discord-utils');
const { twicepedia, managers_role } = require('config/config');
const { Coins } = require('api/models');

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

  const coins = await Coins.top(managers);
  if(coins === undefined)
    return context.send("Whoops. Can't get the top 10 coins. Please try again.");
    
  if(coins.length === 0)
    return context.send('No one has coins yet.');

  const leaderboard = '💰 **TWICE**COINS Leaderboard\n'
    + '```css\n'
    + coins
      .filter(({ discord_id }) => context.guild.member(discord_id))
      .map(data =>
      ({
        user: context.guild.member(data.discord_id).user,
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
