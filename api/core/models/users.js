const { db } = require('../../database');

/**
 * Base class for classes that involve the 'users' table.
 */
exports.Users = class Users
{
  /**
   * Creates a function to query the users table.
   * 
   * @param {string} column The column to do operations on.
   */
  constructor(column)
  {
    this.users = () => db('users');
    this.column = column;
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Returns a knex query builder instance where the 'discord_id' is the given Discord ID.
   * 
   * @param {string} user Discord ID of the user to query.
   */
  _whereUser(user)
  {
    return this.users()
      .select(this.column)
      .where('discord_id', user);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Updates a property of a user.
   * 
   * @param {string} user Discord ID of the user.
   * @param {string | number} value New value to set to the record.
   */
   _update(user, value)
  {
    return this._whereUser(user)
      .update({ [this.column]: value })
			.catch(console.error);
  }

	/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
	
  /**
   * Adds a new user.
   * 
   * @param {string} user Discord ID of the user.
   */
	addUser(user, data)
	{
		
		return this.users()
			.insert(
			{
				discord_id: user,
				coins: data.coins || 0,
				candybongs: data.candybongs || 0,
				items: data.items || '{}',
				collections: data.collections || '[]',
				follows: data.follows || '[]',
			})
			.catch(console.error);
	}

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Gets a property of a given user.
   * 
   * @param {string} user Discord ID of the user.
   */
  ofUser(user)
  {
    return this._whereUser(user)
      .first()
      .then(user => user ? user[this.column] : 0)
      .catch(console.error);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Resets a column of all users.
   * 
   * @param {*} defaultValue The value to set to the column.
   */
  reset(defaultValue = 0)
  {
    return this.users()
      .update({ [this.column]: defaultValue })
      .catch(console.error);
  }
}
