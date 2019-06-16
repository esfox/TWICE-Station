const Sequelize = require('sequelize');
const { Model } = Sequelize;

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

User.getFollows = async id =>
{
  const follows = await getFollows(id);
  return follows? JSON.parse(follows.channels) : undefined;
}

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

User.removeFollows = async (id, channels) =>
{
  const follows = await getFollows(id);
  if(!follows)
    return;

  /** @type {string[]} */
  let followedChannels = JSON.parse(follows.channels);
  followedChannels = followedChannels.filter(id => !channels.includes(id));
  await follows.update({ channels: JSON.stringify(followedChannels) });
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

const getFollows = async id =>
{
  const [ user ] = await User.getByID(id);
  return user.getFollows();
}
