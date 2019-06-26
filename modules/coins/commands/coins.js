const { Command } = require('discord-utils');
const { getMention } = require('utils/functions');
const { coin_image } = require('config/config');
const { User } = require('database');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'coins';
    this.aliases = [ 'bal', 'c' ];
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const author = context.message.author;
  const member = getMention(context, true) || author;
  const userID = member.id;
  const noMention = userID === author.id;  
  const coins = await User.getCoins(userID);
  if(coins === 0)
    return context.reply(noMention? 
      "You don't have coins yet." :
      "That user doesn't have coins yet.");

  const coinsText = `Current TWICECOINS: ${coins.toLocaleString()}`;
  const embed = context.embed(noMention?
      undefined : `💰  ${coinsText}`)
    .setAuthor(noMention? coinsText : member.displayName,
      noMention? coin_image : member.user.displayAvatarURL)
    .setFooter('With these coins you can buy roles for yourself!');
  context.chat(embed, true);
}
