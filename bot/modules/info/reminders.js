const { bot_channel, embed_color, developer } = require('config/config');
const { RichEmbed } = require('discord.js');
const schedule = require('node-schedule');

function makeEmbed()
{
  return new RichEmbed()
    .setColor(embed_color);
}

/**
 * @typedef Job
 * @property {string} name Name of the job.
 * @property {import('node-schedule').RecurrenceRule} recurrence Recurrence rule for the job.
 * @property {Function} message Message to send.
 */
/** @type {Job[]} */
const jobs =
[
  {
    name: 'update-reminder',
    recurrence: { minute: new schedule.Range(0, 59, 30) },
    message: makeEmbed()
      .setTitle('ℹ️  __**Please check your coins, candybongs and items.**__')
      .setDescription(
        'The bot has been updated (but no new features yet).\n\n'
        + `Please @ or DM ${developer.ping} right away if any of those`
        + " aren't correct and also if any problem occurs with the bot.\n\n"
        + "It would be nice if you could help on checking for breaks or bugs"
        + " (since the update was kind of major) so if you encounter one,"
        + " please tell him right away.\n\nThank you!\n\n`possibly new features to come`"
      ),
  },
  {
    name: 'trivia-reminder',
    recurrence: { minute: new schedule.Range(0, 59, 15) },
    message: makeEmbed()
      .setTitle('ℹ️  You can now submit trivias!')
      .setDescription('Command: `;t-submit`\n\n'
        + `Just follow the format:\n`
        + '`;t-submit (question) : (atleast 2 choices) = (number of answer)`\n\n'
        + '*The choices should be comma-separated.*\n\n'
        + '**Example**\n'
        + '`;t-submit Who is the best member? : Sana, Nayeon, Mina, Jihyo = 2`\n\n'
        + 'After submitting, your trivia will be waiting for approval.\n'
        + 'Once it has been approved (or rejected), you would be notified.'
      ),
  },
  {
    name: 'beta-era-reminder',
    recurrence: { minute: new schedule.Range(0, 59, 10) },
    message: makeEmbed()
      .setTitle('ℹ️  __**Era game**__ beta testing is **here**. `we back`')
      .setDescription('**Update: Jeongyeon, Momo, Sana, Jihyo, and Tzuyu pics have been added.**\n\n'
        + 'Check the list of currently available eras in the game with **`;eras`**.\n'
        + 'Try the game with **`;era`**.\n\n'
        + 'Since this is under beta testing, __pictures are very limited__'
        + ' (not all members yet) and the reward is very little.\n\n'
        + 'Stay tuned for more updates to this game!'
      ),
  },
];

/** @param {import('discord.js').Client} bot */
exports.start = bot =>
{
  for(const job of Object.values(schedule.scheduledJobs))
    job.cancel();

  for(const { name, recurrence, message } of jobs)
    schedule.scheduleJob(name, recurrence, () => sendMessage(bot, message));
}

/** @param {import('discord.js').Client} bot */
function sendMessage(bot, message)
{
  const channel = bot.user.id === developer.client
    ? developer.channel : bot_channel;

  const botChannel = bot.channels.get(channel);
  botChannel.send(message);
}
