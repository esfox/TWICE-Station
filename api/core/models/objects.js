const { Users } = require('./users');

/**
 * Base class for classes that involve JSON object values.
 */
exports.Objects = class Objects extends Users
{
  constructor(column)
  {
    super(column);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Updates a property of a user.
   * 
   * @param {string} user Discord ID of the user.
   * @param {[] | {}} value New value to set to the record.
   */
  async _update(user, value)
  {
		value = JSON.stringify(value);
		const queryResult = await super._update(user, value);
    return queryResult !== 0 ? queryResult : super.addUser(user, { [this.column]: value });
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Gets and parses a JSON object property of a user.
   * 
   * @param {string} user Discord ID of the user.
   * @returns {Promise<[] | {}>}
   */
  ofUser(user)
  {
		return super.ofUser(user).then(record => record !== 0 ? JSON.parse(record) : null );
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Sets the JSON object property of a user.
   * 
   * @param {string} user Discord ID of the user.
   * @param {{} | []} json JSON Object property of the user.
   */
  set(user, json)
  {
    return this._update(user, json);
  }
}
