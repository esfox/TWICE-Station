const { Command } = require('discord-utils');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const 
{ 
  cooldowns: cooldown, 
  games_time_limit, 
  rewards
} = require('config/config');

const 
{ 
  randomElement, 
  onCooldown, 
  waitReplies,
  compare
} = require('utils/functions');

const cooldowns = require('utils/cooldown');
const command = 'guessthelyrics';
cooldowns.add(command, cooldown.guess_the_lyrics);

const { User } = require('database');
const { albums } = require('data/music.json');
const songs = Object.values(albums).reduce((links, { tracks }) => 
  links.concat(tracks
    .filter(({ title }) => !title.toLowerCase().includes('ver.'))
    .filter(({ lyrics }) => lyrics)
    .map(({ title, lyrics }) => ({ title, lyrics }))), []);

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

  const { message } = context;
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
  await context.send('❔ Guess the song!  🎵', lyrics);

  const [ response ] = await waitReplies(message, games_time_limit);
  if(!response)
    return message.reply(context.embed("⏰  Time's up!"));

  if(!compare(title, response, true))
    return context.reply('❌  Wrong!');

  const { lyrics: reward } = rewards;
  await User.addCoins(message.author.id, reward);
  context.reply('✅  Correct!', `You win **${reward} TWICECOINS**!`);
}