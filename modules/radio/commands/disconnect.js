const { Command } = require('discord-utils');
const { moderators } = require('config/config');
const player = require('../player');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'disconnect';
    this.aliases.push('stop');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  if(!moderators.some(id => context.message.author.id === id))
    return context.send("❌  You don't have permission to use this command.");

  const userVoiceChannel = context.message.member.voiceChannelID;
  if(!userVoiceChannel || userVoiceChannel !== radio_channel)
    return context.send('❌  You must be in'
      + ` ${context.guild.channels.get(radio_channel).name} voice channel`
      + ' to use this command.');
      
  player.disconnect();
  context.send('⏹  Disconnected from voice channel');
}