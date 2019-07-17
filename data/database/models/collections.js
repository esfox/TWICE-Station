const Sequelize = require('sequelize');
const { Model } = Sequelize;

class Collections extends Model {}

exports.init = sequelize =>
{
  Collections.init({ collections: Sequelize.TEXT },
  {
    sequelize,
    underscored: true,
    timestamps: false,
  });

  return Collections;
}
