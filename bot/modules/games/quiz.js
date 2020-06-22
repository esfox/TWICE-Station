const { RichEmbed, MessageCollector } = require('discord.js');
const { games_time_limit } = require('config/config');
const { Coins } = require('api/models');
const { compare } = require('utils/functions');

/**
 * @param {import('discord-utils').Context} context 
 * @param {import('discord.js').RichEmbed} question 
 * @param {string} answer 
 * @param {number} reward 
 * @param {string | true} info 
 */
async function quiz(context, question, answer, reward, info)
{
  const { message } = context;
  message.channel.stopTyping(true);
  if(question)
    await message.reply(question);

  const user = message.author.id;
  const answered = await message.channel.awaitMessages(
    message => message.author.id === user,
    {
      maxMatches: 1,
      time: games_time_limit * 1000,
      errors: [ 'time' ],
    },
  )
    .catch(() =>
    {
      context.reply(
        "⏰  Time's up!",
        info === true ? `It's **${answer}**.` : undefined,
      );
    });
  
  if(!answered)
    return;

  const isCorrect = compare(answer, message.content, true);

  const title = isCorrect ? '✅  Correct!' : '❌  Wrong!';
  const response = context.embed(title);

  if(isCorrect)
    response.setDescription(`You win **${reward} TWICECOINS**!`);

  if(info && info !== true)
    response.setFooter(info);

  if(isCorrect)
    await Coins.addToUser(message.author.id, reward);
    
  message.reply(response);
}

exports.quiz = quiz;
