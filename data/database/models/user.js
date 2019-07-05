const Sequelize = require('sequelize');
const { Model } = Sequelize;

class User extends Model {}
exports.model = User;

const attributes = 
{
  coins: 'coins',
  candybongs: 'candybongs'
}

exports.init = sequelize =>
{
  User.init(
  {
    user_id: Sequelize.STRING,
    [attributes.coins]: Sequelize.BIGINT,
    [attributes.candybongs]: Sequelize.INTEGER,
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

// #region follows
const getFollows = async user_id => (await this.getByID(user_id)).getFollows();
exports.getFollows = async user_id =>
{
  const follows = await getFollows(user_id);
  if(!follows)
    return;

  const channels = JSON.parse(follows.channels);
  if(channels.length === 0)
    return;
  
  return channels;
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

// #region Coins
exports.getAllCoins = async _ => await getAll(attributes.coins);
exports.getCoins = async user_id =>
{
  const user = await this.getByID(user_id, true);
  return user? user.coins : 0;
};

exports.addCoins = async (user_id, amount) => 
  updateCoins(user_id, amount, true);

exports.setCoins = async (user_id, amount) => 
  updateCoins(user_id, amount);

const updateCoins = (user_id, amount, toAdd) =>
  update(user_id, attributes.coins, amount, toAdd)

exports.resetCoins = async user_id => 
  (await User.update({ coins: 0 }, { where: { user_id } })).shift() !== 0;
// #endregion

// #region Candybongs
exports.getAllCandybongs = async _ => await getAll(attributes.candybongs);
exports.getCandybongs = async user_id =>
{
  const user = await this.getByID(user_id, true);
  return user? user.candybongs : 0;
}

exports.addCandybong = async user_id => 
  updateCandybongs(user_id, 1, true);

exports.minusCandybong = async user_id =>
  updateCandybongs(user_id, -1, true);
  
exports.setCandybongs = async (user_id, amount) => 
  updateCandybongs(user_id, amount);

const updateCandybongs = (user_id, amount, toAdd) =>
  update(user_id, attributes.candybongs, amount, toAdd);
// #endregion

const getAll = async (attribute) => User.findAll()
  .then(async users => await Promise.all(users.map(user => 
  ({
    user_id: user.user_id,
    [attribute]: user[attribute]
  }))));

const update = async (user_id, attribute, amount, toAdd) =>
{
  const user = await this.getByID(user_id);
  user[attribute] = toAdd? user[attribute] + amount : amount;
  return (await user.update(user.dataValues))[attribute];
}