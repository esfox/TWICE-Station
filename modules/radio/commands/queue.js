const { Command } = require('discord-utils');
const queue = require('../queue');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'queue';
    this.aliases.push('q');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  let tracks = queue.get();
  if(!tracks || tracks.length === 0)
    return context.send('No songs are queued.');

  tracks = tracks.slice(1).reduce((list, { title }, i) =>
    list + `${i + 1}. ${title}\n`, '');

  const embed = context.embed('▶  Play Queue');
  if(queue.nowPlaying)
    embed.addField('Now Playing', queue.nowPlaying.title);

  embed.addField('Next Up', tracks);
  context.chat(embed);
}