const { Credits } = require('../core/models/credits');

class Coins extends Credits
{
  constructor()
  {
    /* Set the column to get as 'coins'. */
    super('coins');
  }
}

exports.Coins = new Coins();

