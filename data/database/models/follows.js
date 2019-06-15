const Sequelize = require('sequelize');
const { Model } = Sequelize;

class Follows extends Model {} 

module.exports = sequelize =>
{
  Follows.init({ channels: Sequelize.TEXT },
  {
    sequelize,
    underscored: true,
    timestamps: false,
  });

  return Follows;
}
