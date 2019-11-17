const
{
  twicepedia,
  bot_channel,
  dev_channel,
  rewards
} = require('config/config');

const schedule = require('node-schedule');
const { User } = require('database');
const database = require('database');
const cooldowns = require('utils/cooldown');

/** @param {import('discord.js').Client} bot */
exports.automate = bot =>
{
  const date = new Date();
  date.setUTCHours(12);

  schedule.scheduleJob(
  {
    hour: date.getHours(),
    minute: 0,
    dayOfWeek: 0
  },
  async _ => this.do(bot));

  console.log('CandyBong Reset Automation started.');
}

/** @param {import('discord.js').Client} bot */
exports.do = async bot =>
{
  const candybongs = await User.getTop10Candybongs();
  if(candybongs.length === 0 ||
    candybongs.every(({ candybongs }) => candybongs === 0))
    return bot.channels.get(dev_channel)
      .send('Candybong reset failed. No one has Candybongs.');

  const guild = bot.guilds.get(twicepedia);
  const winners = candybongs
    .filter(({ user_id }) => guild.member(user_id))
    .slice(0, 10)
    .map(({ user_id, candybongs }, i) =>
    ({
      user: user_id,
      candybongs,
      reward: rewards.candybongtop[i]
    }));

  for(let i = 0; i < 10; i++)
  {
    const { user, reward } = winners[0];
    await User.addCoins(user, reward);
  }

  await cooldowns.reset('candybong-get');
  await database.query('update users set candybongs = 0');

  const winnersText = winners
    .reduce((text, { user, candybongs, reward }, i) =>
      text + `${i + 1}. ${guild.member(user)}`
        + ` = **${candybongs}**\\🍭 - __${reward}__\n`, '');

  bot.channels.get(bot_channel)
    .send('🍭  **Candybong Leaderboard Winners** 🎉\n' + winnersText)
    .catch(console.error);
}
