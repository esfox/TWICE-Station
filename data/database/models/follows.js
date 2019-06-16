const Sequelize = require('sequelize');
const { Model } = Sequelize;

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
