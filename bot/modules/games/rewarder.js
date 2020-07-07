const { Coins } = require('api/models')

/**
 * Add coins to a user.
 * 
 * @param {string} user Discord of the user to reward.
 * @param {number} amount Amount of twicecoins to reward.
 */
exports.giveReward = async (user, amount) => await Coins.addToUser(user, amount);
