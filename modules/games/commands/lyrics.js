const { Command } = require('discord-utils');
const config = require('config/config');
const { randomElement, onCooldown } = require('utils/functions');

const cooldowns = require('utils/cooldown');
const command = 'guessthelyrics';
cooldowns.add(command, config.cooldowns.guess_the_lyrics);

const { albums } = require('data/music.json');
const links = Object.values(albums).reduce((links, { tracks }) => 
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

  const { title, lyrics } = randomElement(links);
}