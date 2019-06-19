const Sequelize = require('sequelize');
const { Model, Op } = Sequelize;
const { model: User } = require('./user');

class Follows extends Model {}

exports.init = sequelize =>
{
  Follows.init({ channels: Sequelize.TEXT },
  {
    sequelize,
    underscored: true,
    timestamps: false,
  });

  return Follows;
}

exports.getChannelFollowers = async (channel_id, sender) =>
{
  let followers = await Follows
    .findAll({ where: { channels: { [Op.like]: `%${channel_id}%` }}})
    .map(follow => follow.user_id);
  return User.findAll(
  { 
    where:
    { 
      [Op.and]: 
      [
        { id: { [Op.in]: followers } },
        { user_id: { [Op.not]: sender } }
      ]
    } 
  }).map(user => user.user_id);
}

// exports.getAll = async _ =>
// {
//   let follows = await Follows.findAll();
//   const users = await Promise.all(follows.map(follow => follow.getUser()));
//   follows = follows.map(follow =>
//   {
//     follow = follow.dataValues;
//     delete follow.user_id;
//     follow.user = users.shift().user_id;
//     return follow;
//   });
//   return follows;
// }