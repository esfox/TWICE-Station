const { User } = require('database');
const { games_time_limit } = require('config/config');
const { waitReplies, compare } = require('utils/functions');

/**
 * @param {import('discord-utils').Context} context
 * @param {import('discord.js').RichEmbed} question
 * @param {string} correctAnswer
 * @param {number} reward
 * @param {string | true} [extraInfo]
 */
module.exports = async (context, question, correctAnswer, reward, extraInfo) =>
{
  const message = context.message;
  message.channel.stopTyping(true);
  if(question)
    await message.reply(question);

  const [ response ] = await waitReplies(message, games_time_limit);
  if(!response)
    return message.reply(context.embed("⏰  Time's up!",
      extraInfo === true? `It's **${correctAnswer}**.` : undefined));

  const isCorrect = compare(correctAnswer, response, true);
  const embed = isCorrect?
    context.embed('✅  Correct!', `You win **${reward} TWICECOINS**!`) :
    context.embed('❌  Wrong!');

  if(extraInfo && extraInfo !== true)
    embed.setFooter(extraInfo);

  if(isCorrect)
    await User.addCoins(message.author.id, reward);
    
  message.reply(embed);
}
