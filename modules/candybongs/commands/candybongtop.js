const { Command } = require('discord-utils');
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
  const candybongs = await User.getTop10Candybongs();
  if(candybongs.length === 0)
    return context.send('No one has candybongs yet.');

  const leaderboard = '🍭 Candy Bong Leaderboard\n'
    + '```css\n'
    + candybongs.map(data =>
      ({
        user: context.guild.member(data.user_id).user,
        candybongs: data.candybongs
      }))
      .filter(({ user }) => user)
      .slice(0, 10)
      .reduce((table, { user, candybongs }, i) =>
        table + `#${i + 1}`.padEnd(5, ' ')
          + `[ ${candybongs.toString().padStart(3, ' ')} 🍭 ]  `
          + `${user.displayName}\n`, '')
    + '\n```';
  context.chat(leaderboard);
}
