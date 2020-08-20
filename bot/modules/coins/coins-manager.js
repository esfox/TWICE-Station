const { Coins } = require('api/models')
const { Logger } = require('utils/logger');
const donators = require('data/donators.json');

/**
 * Add coins to a user.
 * 
 * @param {string} user Discord of the user to reward.
 * @param {number} amount Amount of twicecoins to reward.
 */
exports.addCoins = async (user, amount) =>
{
	if(donators.includes(user))
		amount = Math.round(amount * 1.5);

	const coinsAddResult = await Coins.addToUser(user, amount)
		.catch(error =>
		{
			Logger.error(`Cannot add coins to user with Discord ID of ${user}.`);
			Logger.error(error);
		});

	return coinsAddResult ? amount : null;
};
