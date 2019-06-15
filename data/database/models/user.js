const Sequelize = require('sequelize');
const { Model } = Sequelize;
const { Follows } = require('..');

class User extends Model {}

User.getByID = user =>
{
  return User.findOrCreate(
  {
    where: { user_id: user },
    defaults: 
    {
      coins: 0,
      candybongs: 0
    }
  });
}

/** @param {string[]} channels */
User.addFollows = async (user, channels) =>
{
  [ user ] = await User.getByID(user);
  
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
