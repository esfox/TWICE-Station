const { search } = require('utils/functions');

module.exports = class
{
  static setNowPlaying(track)
  {
    this.nowPlaying = track;
  }

  static get()
  {
    return this.tracks;
  }

  static next()
  {
    if(!this.tracks)
      return;
    
    return this.tracks.shift();
  }

  static add(track)
  {
    if(!this.tracks)
      this.tracks = [];

    this.tracks.push(track);
  }

  static remove(track)
  {
    if(!this.tracks)
      return;

    track = search(this.tracks, track);
    this.tracks.splice(this.tracks.indexOf(track), 1);
  }
}
