const command = 'guessthesong';

const { Command } = require('discord-utils');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const quiz = require('../quiz');

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

const file = 'Song.mp3';

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  if(await onCooldown(context, command))
    return;

  const { title, link } = randomElement(songs);

  const processed = await processAudio(context, link)
    .catch(error =>
    {
      if(error)
        console.error(error);
      context.reply('❌ Whoops! An error occurred. Try again.');
    });
  if(!processed)
    return;

  const attachment = { files: [{ attachment: `./${file}`, name: file }]};
  context.message.reply(`${context.message.author}\n`
    + '❔ Guess the Song! 🎵', attachment)
    .then(_ => fs.unlink(file, error => 
    {
      if(error)
        console.error(error);
    }));

  quiz(context, undefined, title, rewards.song_guess, true);
}

async function processAudio(context, link)
{
  return new Promise(async (resolve, reject) =>
  {
    if(!fs.existsSync(link))
      return reject();

    let startTime = await getAudioDurationInSeconds(link)
      .catch(error => reject(error));

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
        resolve(true);
      })
      .on('error', error =>
      {
        sendError(context, link);
        reject(error);
      })
      .run();   
  });
}

/** @param {import('discord-utils').Context} context*/
function sendError(context, link)
{
  context.guild.members.get(developer.id).send(context
    .embed(`Error occured in Guess the Song:\n${link}`))
}