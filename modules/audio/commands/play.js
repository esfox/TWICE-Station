const { Command } = require('discord-utils');
const player = require('../player');
const queue = require('../queue');
const play = require('../play');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'play';
    this.aliases.push('p');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  if(player.isPaused)
  {
    player.resume();
    return context.send('▶  Resumed');
  }

  const { raw_parameters } = context;
  if(!raw_parameters)
    return context.send('What song to play?');

  if(player.isPlaying)
  {
    queue.add(raw_parameters);
    return context.send(`Queued ${raw_parameters}`);
  }

  if(!player.connection)
    await player.connect();

  play(context, queue.next() || raw_parameters);
}
