const { Command } = require('discord-utils');
const { compare } = require('utils/functions');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { albums } = require('data/music.json');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'lyrics';
    this.aliases.push('l');
    this.action = action;
  }
}

const languages = 
{
  'rom': 0,
  'han': 1,
  'eng': 2,
  'kr': 1,
  'jp': 1,
  'jpn': 1,
};

/** @type {Array]} */
const songs = Object.values(albums)
  .map(album => album.tracks)
  .reduce((songs, tracks) => 
    songs.concat(tracks), []);

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const parameters = context.parameters;
  if(!parameters)
    return context.send('What song to find the lyrics of?');

  let [ language ] = parameters;
  if(Object.keys(languages).includes(language))
    parameters.splice(0, 1);
  else
    [ language ] = Object.keys(languages);

  let [ ...song ] = parameters;
  song = songs.find(({ title }) => compare(title, song.join(' ')));
  if(!song)
    return context.send('❌  Cannot find that song.');

  context.message.channel.startTyping();

  let { lyrics } = song;
  const html = await fetch(lyrics)
    .then(response => response.text())
    .catch(console.error);
  if(!html)
    return context.error('Cannot get lyrics HTML.', context);

  const $ = cheerio.load(html);
  lyrics = cheerio.load($('table').toArray()
    .find(element => $(element).attr('border') === '0'))('td').toArray()
    .map(e => $(e).text());
    
  context.message.channel.stopTyping(true);

  const text = lyrics[languages[language]];
  if(!text || text.toLowerCase() === 'n/a')
    context.send('The song does not have that language.');

  const { title } = song;
  if(text.length <= 2000)
    return context.send(title, text);

  const blocks = text.match(/(.|[\r\n]){1,2048}(\n|$)/g);
  for(const i in blocks)
    await context.send(parseInt(i) === 0? title : undefined, blocks[i]);
}