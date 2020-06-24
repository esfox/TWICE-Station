const { bot_channel, embed_color, developer } = require('config/config');
const { RichEmbed } = require('discord.js');
const schedule = require('node-schedule');

/** @param {import('discord.js').Client} bot */
exports.startUpdateReminder = bot =>
{
  const reminder = new RichEmbed()
    .setColor(embed_color)
    .setTitle('ℹ️  __**Please check your coins, candybongs and items.**__')
    .setDescription('The bot has been updated (but no new features yet).\n\n'
      + `Please @ or DM ${developer.ping} right away if any of those`
      + " aren't correct and also if any problem occurs with the bot.\n\n"
      + "It would be nice if you could help on checking for breaks or bugs"
      + " (since the update was kind of major) so if you encounter one,"
      + " please tell him right away.\n\nThank you!\n\n`possibly new features to come`");

  schedule.scheduleJob(
    { minute: new schedule.Range(0, 59, 15) },
    () => sendMessage(bot, reminder),
  );
};

/** @param {import('discord.js').Client} bot */
exports.startTriviaSubmissionReminder = bot =>
{
  const reminder = new RichEmbed()
    .setColor(embed_color)
    .setTitle('ℹ️  You can now submit trivias!')
    .setDescription('Command: `;t-submit`\n\n'
      + `Just follow the format:\n`
      + '`;t-submit (question) : (atleast 2 choices) = (number of answer)`\n\n'
      + '*The choices should be comma-separated.*\n\n'
      + '**Example**\n'
      + '`;t-submit Who is the best member? : Sana, Nayeon, Mina, Jihyo = 2`\n\n'
      + 'After submitting, your trivia will be waiting for approval.\n'
      + 'Once it has been approved (or rejected), you would be notified.'
    );

  schedule.scheduleJob(
    { minute: new schedule.Range(0, 59, 10) },
    () => sendMessage(bot, reminder),
  );
};

function sendMessage(bot, message)
{
  const botChannel = bot.channels.get(bot_channel);
  botChannel.send(message);
}
