const
{
  radio_channel,
  twicepedia
} = require('config/config');

module.exports = class
{
  /** @param {import('discord.js').Client} bot */
  static init(bot)
  {
    /** @type {import('discord.js').VoiceChannel} */
    this.channel = bot.channels.get(radio_channel);
    this.connections = bot.voiceConnections;
    console.log('Audio player initialized.');
  }

  static async connect()
  {
    if(this.connection)
      return;

    await this.channel.join()
      .catch(console.error);
    
    this.connection = this.connections.get(twicepedia);
    return true;
  }

  static disconnect()
  {
    this.stopped = true;
    this.connection.disconnect();
    this.connection = undefined;
  }

  static notConnected()
  {
    return !this.connection || !this.connection.dispatcher;
  }

  static play(audio, onStart, onEnd, onError) 
  {
    if(!this.connection)
      return;

    this.isPlaying = true;
    this.stopped = false;
    this.connection.playFile(audio, { bitrate: 256000 });
    this.connection.dispatcher.setVolume(0.3);
    this.connection.dispatcher.on('start', _ =>
    {
      if(!this.stopped && onStart)
        onStart();
    });

    this.connection.dispatcher.on('end', _ =>
    {
      this.isPlaying = false;
      if(this.stopped)
        return;
        
      this.connection.player.streamingData.pausedTime = 0;
      if(onEnd)
        onEnd();
    });

    this.connection.dispatcher.on('error', error =>
    {
      console.error(error);
      if(onError)
        onError(error);
    });
  }

  static pause()
  {
    if(this.notConnected())
      return;

    this.connection.dispatcher.pause();
  }

  static resume()
  {
    if(this.notConnected())
      return;

    this.connection.dispatcher.resume();
  }

  static skip()
  {
    if(this.notConnected())
      return;

    this.connection.dispatcher.end();
  }

  static get isPaused()
  {
    if(this.notConnected())
      return;

    return this.connection.dispatcher.paused;
  }
}
