const Sequelize = require('sequelize');

/** @type {import('sequelize').Sequelize} */
const sequelize = new Sequelize
({
    dialect: 'sqlite',
    storage: './data/database/data.sqlite'
});

const { User, Items, Follows } = require('./models')(sequelize);
exports.init = _ => 
{
  associateModels();

  return sequelize.sync(/* { force: true } */)
    .catch(console.error);
}

const associateModels = _ =>
{
  User.hasOne(Items, { as: 'Bag ', foreignKey: 'user_id' });
  User.hasOne(Follows, { as: 'Follows', foreignKey: 'user_id' });
}

exports.User = User;
exports.Items = Items;
exports.Follows = Follows;