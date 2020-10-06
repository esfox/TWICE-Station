const { Objects } = require('../core/models/objects');

class Items extends Objects
{
  constructor()
  {
    /* Set the column to get as 'items'. */
    super('items');
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Adds an item to a user's existing item bag, but checks first if the count
   * of the user's current items is 100, which is the limit.
   * If it is at the limit, it returns `false`.
   * 
   * @param {string} user Discord ID of the user.
   * @param {string} item Code of the item to add.
   */
  async addToUser(user, item)
  {
		const items = await super.ofUser(user) || {};

    if(Object.keys(items).reduce((total, code) => total + items[code], 0) === 100)
      return false;

    const itemCount = items[item];
    items[item] = ! itemCount ? 1 : itemCount + 1;
    return super._update(user, items);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Resets all item bags to empty.
   */
  reset()
  {
    return super.reset('{}');
  }
}

exports.Items = new Items();
