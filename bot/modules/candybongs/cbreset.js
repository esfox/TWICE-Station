const
{
  twicepedia,
  bot_channel,
  dev_channel,
  rewards
} = require('config/config');

const schedule = require('node-schedule');
const cooldowns = require('utils/cooldown');
const { Logger } = require('utils/logger');
const { Coins, Candybongs } = require('api/models');

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

  console.log('Candy Bong Reset Automation started.');
}

/** @param {import('discord.js').Client} bot */
exports.do = async bot =>
{
  Logger.info('Candy Bong reset executed.');
  const devChannel = bot.channels.get(dev_channel);
    
  const candybongs = await Candybongs.top();
  if(candybongs === undefined)
    return devChannel.send('Candybong reset failed. An error occurred on getting the candybongs.');

  if(candybongs.length === 0 || candybongs.every(({ candybongs }) => candybongs === 0))
    return devChannel.send('Candybong reset failed. No one has Candybongs.');

  const guild = bot.guilds.get(twicepedia);
  const winners = candybongs
    .filter(({ discord_id }) => guild.member(discord_id))
    .map(({ discord_id, candybongs }, i) =>
    ({
      user: discord_id,
      candybongs,
      reward: rewards.candybongtop[i]
    }));

  for(const winner of winners)
  {
    const { user, reward } = winner;
    const rewardResult = await Coins.addToUser(user, reward);
    if(rewardResult === undefined)
      return devChannel.send('Candybong reset failed. An error has occurred on adding coins.');
  }

  await cooldowns.reset('candybong-get');

  const resetResult = await Candybongs.reset();
  if(resetResult === undefined)
    return devChannel.send('Error occurred on resetting the candybongs, but coins were awarded.');

  const winnersText = winners.reduce((text, { user, candybongs, reward }, i) =>
    text + `${i + 1}. ${guild.member(user)} = **${candybongs}**\\🍭 - __${reward}__\n`, '');

  bot.channels.get(bot_channel)
    .send('🍭  **Candybong Leaderboard Winners** 🎉\n' + winnersText)
    .catch(console.error);
}
