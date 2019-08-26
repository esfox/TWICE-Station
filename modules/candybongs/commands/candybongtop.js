const { Command } = require('discord-utils');
const { getTop10 } = require('utils/functions');
const { User } = require('database');

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
  const candybongs = await User.getAllCandybongs();
  if(candybongs.length === 0)
    return context.send('No one has candybongs yet.');

  const leaderboard = '🍭 Candy Bong Leaderboard\n'
    + '```css\n'
    + getTop10(context.guild, candybongs, 'candybongs')
      .map(data =>
      ({
        user: context.guild.member(data.user_id),
        candybongs: data.candybongs
      }))
      .reduce((table, { user, candybongs }, i) =>
        table + `#${i + 1}`.padEnd(5, ' ')
          + `[ ${candybongs.toString().padStart(3, ' ')} 🍭 ]  `
          + `${user.displayName}\n`, '')
    + '\n```';
  context.chat(leaderboard);
}
