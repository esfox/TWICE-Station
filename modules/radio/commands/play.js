const { Command } = require('discord-utils');
const player = require('../player');
const queue = require('../queue');
const { play, findSong, songEmbed, notJoined } = require('../functions');

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
  if(notJoined(context))
    return;

  if(!player.isStopped && player.isPaused)
  {
    player.resume();
    return context.send('▶  Resumed');
  }

  const { raw_parameters } = context;
  if(!raw_parameters)
    return context.send('What song to play?');
    
  const track = findSong(raw_parameters);
  if(!track)
    return context.send("❌  Can't find a song with that title.");

  if(player.isPlaying)
  {
    queue.add(track);
    return context.chat(songEmbed(context, track, '✅  Queued...'));
  }

  if(!player.connection)
    await player.connect();

  play(context, queue.next() || track.link);
}
