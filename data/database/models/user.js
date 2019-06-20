const Sequelize = require('sequelize');
const { Model } = Sequelize;

class User extends Model {}
exports.model = User;

exports.init = sequelize =>
{
  User.init(
  {
    user_id: Sequelize.STRING,
    coins: Sequelize.BIGINT,
    candybongs: Sequelize.INTEGER,
  },
  {
    sequelize,
    underscored: true,
  });

  return User;
}

// #region User-specific
exports.getByID = async (user_id, notCreate) => !notCreate?
  User.findOrCreate(
  {
    where: { user_id },
    defaults: 
    {
      coins: 0,
      candybongs: 0
    }
  })
  .then(([ user ]) => user) :
  User.findOne(
  {
    where: { user_id }
  });
// #endregion

// #region Coins
exports.getCoins = async user_id =>
{
  const user = await this.getByID(user_id, true);
  return user? user.coins : 0;
};

exports.addCoins = async (user_id, amount) =>
{
  const user = await this.getByID(user_id);
  user.coins += amount;
  return (await user.update(user.dataValues)).coins;
}

exports.resetCoins = async user_id => 
  (await User.update({ coins: 0 }, { where: { user_id } })).shift() !== 0;
// #endregion

// #region follows
const getFollows = async user_id => (await this.getByID(user_id)).getFollows();
exports.getFollows = async user_id =>
{
  const follows = await getFollows(user_id);
  return follows? JSON.parse(follows.channels) : undefined;
}

exports.addFollows = async (user_id, channels) =>
{
  const user = await this.getByID(user_id);
  let follows = await user.getFollows();
  if(!follows)
  {
    follows = await user.createFollows({ channels: JSON.stringify(channels) });
    return JSON.parse(follows.channels);
  }

  const followedChannels = JSON.parse(follows.channels);
  const notFollowed = channels.filter(channel => 
    !followedChannels.includes(channel));
  if(notFollowed.length === 0)
    return false;
  
  followedChannels.push(...notFollowed);
  await follows.update({ channels: JSON.stringify(followedChannels) });
  return notFollowed;
}

exports.removeFollows = async (user_id, channels) =>
{
  const follows = await getFollows(user_id);
  if(!follows)
    return;

  /** @type {string[]} */
  let followedChannels = JSON.parse(follows.channels);
  followedChannels = followedChannels.filter(id => !channels.includes(id));
  await follows.update({ channels: JSON.stringify(followedChannels) });
}
// #endregion
