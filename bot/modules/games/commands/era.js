const command = 'era';

const { Command } = require('discord-utils');
const { quiz } = require('../quiz');
const imgur = require('imgur');

const { cooldowns: cooldown, rewards } = require('config/config');
const { onCooldown, randomElement } = require('utils/functions');
const { Logger } = require('utils/logger');
const eraPictures = require('data/era-pics.json');

const cooldowns = require('utils/cooldown');
cooldowns.add(command, cooldown.era_guess);

imgur.setAPIUrl('https://api.imgur.com/3/');
imgur.setCredentials('twice.station.dev@gmail.com', 'teud00ng!e', 'fd6ffbae25e2c7e');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = command;
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  if(await onCooldown(context, command))
    return;

  /* Get a random Imgur Image ID. */
  const imageID = randomElement(eraPictures);

  /* Request image info using the ID. */
  context.message.channel.startTyping();
  let imgurResponse = await imgur.getInfo(imageID)
    .catch(error => Logger.error(error.message));
  context.message.channel.stopTyping(true);

  /* Log Imgur API response. */
  Logger.imgur(`Response from Imgur API:\n${JSON.stringify(imgurResponse, null, 2)}`);

  /* Check if the request was successful. */
  if(!imgurResponse || !imgurResponse.success)
    return error(context);

  /* Get the image filename (which contains the era info) and link. */
  const { name, link } = imgurResponse.data;

  /* Check if there is era info in the filename. */
  let info = name.match(/(?<=\[)(.*?)(?=\])/g);
  if(!info)
  {
    Logger.error(`No era info was found in the image "${link}"`);
    return error(context);
  }

  /* Get the era info from the filename. */
  const eraInfo = info.shift();
  let [ , era ] = eraInfo.split('|');
  if(!era)
  {
    Logger.error(`Era info is invalid in image "${link}" (Info: ${info.shift()})`);
    return error(context);
  }

  /* Remove underscores in era string. */
  era = era.replace(/_/g, '');

  // Temporary notice
  context.chat('The era game is under beta testing and has limited pictures currently'
    + ', so the reward is also very little.');

  /* Create the embed. */
  const question = context
    .embed(`🖼️  Guess the era!`)
    .setImage(link)
    .setFooter('See the list of eras by doing ;eras (after answering).');

  /* Do the quiz. */
  quiz(context, question, era, rewards.era_guess);
}

function error(context)
{
  context.reply('❌  Whoops! Something went wrong. Try again later.');
}
