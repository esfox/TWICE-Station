const { Objects } = require('../core/models/objects');

class Follows extends Objects
{
  constructor()
  {
    /* Set the column to get as 'collections'. */
    super('follows');
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  
  /**
   * Add followed channels to a user, but removes first
   * the channels given that are already saved.
   * 
   * @param {string} user Discord ID of the user.
   * @param {string[] | string} channels Array of channel IDs followed.
   */
  async addToUser(user, channels)
  {
    channels = this._toArray(channels);

    let follows = await this.ofUser(user);
    channels = channels.filter(channel => !follows.includes(channel));
    follows = follows.concat(channels);
    return this._update(user, follows);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Removes unfollowed channels to a user, not including the
   * channels that aren't unfollowed in the user's given channels.
   * 
   * @param {string} user Discord ID of the user.
   * @param {string[] | string} channels Array of channel IDs unfollowed.
   */
  async removeFromUser(user, channels)
  {
    channels = this._toArray(channels);

    const follows = await this.ofUser(user);
    channels = follows.filter(channel => !channels.includes(channel));
    return this._update(user, channels);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Resets all follows to empty.
   */
  reset()
  {
    return super.reset('[]');
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Turns a parameter into an array, if it isn't.
   */
  _toArray(data)
  {
    if(!Array.isArray(data))
      data = [ data ];

    return data;
  }

}

exports.Follows = new Follows();

