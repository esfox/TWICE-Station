const { RichEmbed, MessageCollector } = require('discord.js');
const { games_time_limit, embed_color } = require('config/config');
const { compare } = require('utils/functions');
// const { User } = require('database');
const { Coins } = require('api/models');

class Quiz
{
  /**
   * @param {import('discord.js').Message} message
   * @param {import('discord.js').RichEmbed} question
   * @param {string} correctAnswer
   * @param {number} reward
   * @param {string | true} [extraInfo]
   */
  constructor(message, question, correctAnswer, reward, extraInfo)
  {
    this.start(message, question, correctAnswer, reward, extraInfo);
  }

  async start(message, question, correctAnswer, reward, extraInfo)
  {
    message.channel.stopTyping(true);
    if(question)
      await message.reply(question);

    const embed = new RichEmbed()
      .setColor(embed_color);

    const options =
    {
      max: 1,
      time: games_time_limit * 1000
    };
  
    const collector = new MessageCollector(message.channel, 
      msg => msg.author.id === message.author.id,
      options)
  
    let answered = false;
    collector.on('collect', async ({ content }) =>
    {
      answered = true;
      const isCorrect = compare(correctAnswer, content, true);
      embed.setTitle(isCorrect?
        '✅  Correct!' :
        '❌  Wrong!');

      if(isCorrect)
        embed.setDescription(`You win **${reward} TWICECOINS**!`);

      if(extraInfo && extraInfo !== true)
        embed.setFooter(extraInfo);
  
      if(isCorrect)
        await Coins.addToUser(message.author.id, reward);
        // await User.addCoins(message.author.id, reward);
        
      message.reply(embed);
    });

    collector.on('end', () =>
    {
      if(answered)
        return;

      embed.setTitle("⏰  Time's up!");
      if(extraInfo === true)
        embed.setDescription(`It's **${correctAnswer}**.`);
      return message.reply(embed);
    });
  }
}

module.exports = (message, question, correctAnswer, reward, extraInfo) =>
  new Quiz(message, question, correctAnswer, reward, extraInfo);
