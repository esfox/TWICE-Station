const Sequelize = require('sequelize');
const { Model } = Sequelize;

class Items extends Model {}

module.exports = sequelize =>
{
  Items.init({ items: Sequelize.TEXT },
  {
    sequelize,
    underscored: true,
    timestamps: false,
  });

  return Items;
}
