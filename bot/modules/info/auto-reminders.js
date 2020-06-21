const { bot_channel, embed_color } = require('config/config');
const { RichEmbed } = require('discord.js');
const schedule = require('node-schedule');

/** @param {import('discord.js').Client} bot */
exports.startUpdateReminder = bot =>
{
  const reminder = new RichEmbed()
    .setColor(embed_color)
    .setTitle('ℹ️  __**Please check your coins, candybongs and items.**__')
    .setDescription('The bot has been updated (but no new features yet).\n\n'
      + "Please @ or DM <@247955535620472844> right away if any of those"
      + " aren't correct and also if any problem occurs with the bot.\n\n"
      + "It would be nice if you could help on checking for breaks or bugs"
      + " (since the update was kind of major) so if you encounter one,"
      + " please tell him right away.\n\nThank you!\n\n`possibly new features to come`");

  const sendReminder = () =>
  {
    /** @type {import('discord.js').TextChannel} */
    const botChannel = bot.channels.get(bot_channel);
    botChannel.send(reminder);
  };

  schedule.scheduleJob({ minute: new schedule.Range(0, 59, 10) }, sendReminder);
};
