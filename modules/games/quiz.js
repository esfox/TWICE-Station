const { User } = require('database');
const { games_time_limit } = require('config/config');
const { waitReplies, compare } = require('utils/functions');

/**
 * @param {import('discord-utils').Context} context
 * @param {import('discord.js').RichEmbed} question
 * @param {string} correctAnswer
 * @param {number} reward
 */
module.exports = async (context, question, correctAnswer, reward) =>
{
  const message = context.message;
  message.channel.stopTyping(true);
  await message.reply(question);

  const [ response ] = await waitReplies(message, games_time_limit);
  if(!response)
    return message.reply(context.embed("⏰  Time's up!"));

  if(!compare(correctAnswer, response, true))
    return context.reply('❌  Wrong!');

  await User.addCoins(message.author.id, reward);
  context.reply('✅  Correct!', `You win **${reward} TWICECOINS**!`);
}
