const Sequelize = require('sequelize');
const { Model } = Sequelize;

class Items extends Model {}

exports.init = sequelize =>
{
  Items.init({ items: Sequelize.TEXT },
  {
    sequelize,
    underscored: true,
    timestamps: false,
  });

  return Items;
}
