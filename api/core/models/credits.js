const { db } = require('../../database');
const { Users } = require('./users');

/**
 * Base class for classes that involve numeric values.
 */
exports.Credits = class Credits extends Users
{
  constructor(column)
  {
    super(column);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Updates a numeric property of a user (coins or candybongs).
   * 
   * @param {string} action Operation to do ('add' or 'subtract').
   * @param {string} user Discord ID of the user.
   * @param {number} amount Amount to add or subtract.
   */
  async _update(action, user, amount)
  {
    const newValue = db.raw(`${this.column} ${action === 'add' ? '+' : '-'} ${Math.abs(amount)}`);
		const queryResult = await super._update(user, newValue);
		return queryResult !== 0 ? queryResult : super.addUser(user, { [this.column]: amount });
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Gets the top 10 with most of the property (coins or candybongs).
   * 
   * @param {string[]} excludes Discord IDs of the users to exclude in the query.
   */
  top(excludes = [])
  {
    return this.users()
      .whereNotIn('discord_id', excludes)
      .andWhereNot(this.column, 0)
      .orderBy(this.column, 'desc')
      .limit(10)
      .catch(console.error);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Adds an amount of the property to a user.
   * 
   * @param {string} user Discord ID of the user.
   * @param {number} amount Amount to add.
   */
  addToUser(user, amount)
  {
    return this._update('add', user, amount);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Subtracts an amount of the property to a user.
   * 
   * @param {string} user Discord ID of the user.
   * @param {number} amount Amount to subtract.
   */
  subtractFromUser(user, amount)
  {
    return this._update('subtract', user, amount);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Transfers an amount of a property from one user to another.
   * If the numeric property of the user to get from is or the amount
   * given is greater than the user's numeric property, this returns 0.
   * 
   * @param {string} from Discord ID of the user to take from.
   * @param {string} to Discord ID of the user to add to.
   * @param {number} amount Amount to transfer.
   */
  async transfer(from, to, amount)
  {
    const giverCredits = await this.ofUser(from);
    if(giverCredits <= 0 || amount > giverCredits)
      return 0;

    amount = Math.abs(amount);
    await this.subtractFromUser(from, amount);
    return this.addToUser(to, amount);
  }
}
