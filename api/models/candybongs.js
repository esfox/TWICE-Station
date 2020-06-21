const { Credits } = require('../core/models/credits');

class Candybongs extends Credits
{
  constructor()
  {
    /* Set the column to get as 'candybongs'. */
    super('candybongs');
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Adds 1 candybong to a user.
   * 
   * @param {string} user Discord ID of the user.
   */
  addToUser(user)
  {
    return super.addToUser(user, 1);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Subtracts 1 candybong to a user.
   * 
   * @param {string} user Discord ID of the user.
   */
  subtractFromUser(user)
  {
    return super.subtractFromUser(user, 1);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Transfers 1 candybong to another user.
   * 
   * @param {string} from Discord ID of the user to take a candybong from.
   * @param {string} to Discord ID of the user to transfer a candybong to. 
   */
  transfer(from, to)
  {
    return super.transfer(from, to, 1);
  }
}

exports.Candybongs = new Candybongs();
