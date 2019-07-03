const command = 'guessthelyrics';

const { Command } = require('discord-utils');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const quiz = require('../quiz');

const { cooldowns: cooldown, rewards } = require('config/config');
const { randomElement, onCooldown } = require('utils/functions');
const { albums } = require('data/music.json');
const songs = Object.values(albums).reduce((links, { tracks }) => 
  links.concat(tracks
    .filter(({ title }) => !title.toLowerCase().includes('ver.'))
    .filter(({ lyrics }) => lyrics)
    .map(({ title, lyrics }) => ({ title, lyrics }))), []);

const cooldowns = require('utils/cooldown');
cooldowns.add(command, cooldown.lyrics_guess);

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = command;
    this.aliases.push('gtl');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  if(await onCooldown(context, command))
    return;

  context.message.channel.startTyping();

  const { title, lyrics: link } = randomElement(songs);
  const html = await fetch(link)
    .then(response => response.text())
    .catch(error => context.error(error, context));
  
  const $ = cheerio.load(html);
  let lyrics = $('.entry-content table[border=0] td:first-of-type > p')
    .toArray()
    .map(element => $(element).text())
    .filter(text => text.length !== 0 || 
      !text.toLowerCase().match(title.toLowerCase()))
    .filter(text => text.split('\n').length > 1);

  lyrics = randomElement(lyrics).split('\n').slice(0, 4).join('\n');
  const question = context.embed('❔ Guess the song!  🎵', lyrics);

  quiz(context, question, title, rewards.lyrics_guess);
}