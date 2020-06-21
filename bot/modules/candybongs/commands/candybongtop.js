const { Command } = require('discord-utils');
const { Candybongs } = require('api/models');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'candybongtop';
    this.aliases.push('cbtop');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const candybongs = await Candybongs.top();
  if(candybongs === undefined)
    return context.error("Whoops. Can't get the Candy Bong leaderboard. Please try again.");

  if(candybongs.length === 0)
    return context.send('No one has candybongs yet.');

  const leaderboard = '🍭 Candy Bong Leaderboard\n'
    + '```css\n'
    + candybongs
      .filter(({ discord_id }) => context.guild.member(discord_id))
      .map(data =>
      ({
        user: context.guild.member(data.discord_id),
        candybongs: data.candybongs
      }))
      .slice(0, 10)
      .reduce((table, { user, candybongs }, i) =>
        table + `#${i + 1}`.padEnd(5, ' ')
          + `[ ${candybongs.toString().padStart(3, ' ')} 🍭 ]  `
          + `${user.displayName}\n`, '')
    + '\n```';

  context.chat(leaderboard);
}
