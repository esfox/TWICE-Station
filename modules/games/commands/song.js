const command = 'guessthesong';

const { Command } = require('discord-utils');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const { cooldowns: cooldown, rewards, developer } = require('config/config');
const { randomElement, onCooldown } = require('utils/functions');

const { albums } = require('data/music.json');
const songs = Object.values(albums).reduce((links, { tracks }) => 
  links.concat(tracks
    .filter(({ title, link }) => !title.toLowerCase().includes('ver.') && link)
    .map(({ title, link }) => ({ title, link }))), []);

const cooldowns = require('utils/cooldown');
cooldowns.add(command, cooldown.song_guess);

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = command;
    this.aliases.push('gts');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const { title, link } = randomElement(songs);

  await processAudio(context, link);

  const attachment = { files: [{ attachment: './Song.mp3', name: 'Song.mp3' }]};
  context.chat(`${context.message.author}\n`
    + '❔ Guess the Song! 🎵', false, attachment)

  // if(await onCooldown(context, command))
  //   return;

}

function processAudio(context, link)
{
  return new Promise(async resolve =>
  {
    let startTime = await getAudioDurationInSeconds(link)
    .catch(error =>
    {
      console.error(error);
      context.reply('❌ Whoops! An error occurred. Try again.', )
    });

    if(!startTime)
      return;

    startTime = Math.floor(Math.random() * (~~startTime) - 5);
    if(startTime <= 0)
      startTime += 5;

    ffmpeg(link)
      .setStartTime(startTime)
      .setDuration(0.75)
      .noVideo()
      .output('Song.mp3')
      .on('end', error =>
      {
        if(error)
          return sendError(context, error);
        return resolve();
      })
      .on('error', error =>
      {
        sendError(context, error);
      })
      .run();
  });
}

/** @param {import('discord-utils').Context} context*/
function sendError(context, link, error)
{
  console.error(error);
  context.guild.members.get(developer.id).send(context
    .embed(`Error occured in Guess the Song:\n${link}`))
}