const Sequelize = require('sequelize');
const { Model } = Sequelize;
const { Follows } = require('..');

class User extends Model {}

User.getByID = id =>
{
  return User.findOrCreate(
  {
    where: { user_id: id },
    defaults: 
    {
      coins: 0,
      candybongs: 0
    }
  });
}

/** @param {string[]} channels */
User.addFollows = async (id, channels) =>
{
  const [ user ] = await User.getByID(id);
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

User.getFollows = async id =>
{
  const [ user ] = await User.getByID(id);
  const follows = await user.getFollows();
  return follows? JSON.parse(follows.channels) : undefined;
}

module.exports = sequelize =>
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
