const { Objects } = require('../core/models/objects');

class Collections extends Objects
{
  constructor()
  {
    /* Set the column to get as 'collections'. */
    super('collections');
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Adds a collection to a user. If the collection already exists in the
   * users's existing collections, do not add the new collection.
   * 
   * @param {string} user Discord ID of the user.
   * @param {string} collection Code of the collection to add.
   */
  async addToUser(user, collection)
  {
    const collections = await this.ofUser(user);
    if(collections.includes(collection))
      return;

    collections.push(collection);
    return this._update(user, collections);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Removes a collection from a user. If the collection is not in the user's
   * existing collections, the colletion will not be removed.
   * 
   * @param {string} user Discord ID of the user.
   * @param {string} collection Code of the collection to remove.
   */
  async removeFromUser(user, collection)
  {
    let collections = await this.ofUser(user);
    if(!collections.includes(collection))
      return;

    collections = collections.filter(code => collection !== code);
    return this._update(user, collections);
  }

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

  /**
   * Resets all collections to empty.
   */
  reset()
  {
    return super.reset('[]');
  }
}

exports.Collections = new Collections();
