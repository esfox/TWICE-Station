const Sequelize = require('sequelize');

/** @type {import('sequelize').Sequelize} */
const sequelize = new Sequelize
({
    dialect: 'sqlite',
    storage: './data/database/data.sqlite'
});

/** 
 * @typedef {typeof import('sequelize').Model} Model
 * 
 * @typedef {Object} Models
 * @property {Model} User
 * @property {Model} Items
 * @property {Model} Follows
 * @property {Model} Collections
 */

/** @type {Models} */
const { User, Items, Follows, Collections } = require('./models')(sequelize);
exports.init = _ => 
{
  associateModels();

  return sequelize.sync(/* { force: true } */)
    .catch(console.error);
}

exports.query = async query =>
{
  return sequelize.query(query);
}

const associateModels = _ =>
{
  User.hasOne(Follows, { as: 'Follows', foreignKey: 'user_id' });
  User.hasOne(Items, { as: 'Items', foreignKey: 'user_id' });
  User.hasOne(Collections, { as: 'Collections', foreignKey: 'user_id' });
  Follows.belongsTo(User, { foreignKey: 'user_id' });
}

exports.User = require('./models/user');
exports.Items = require('./models/items');
exports.Follows = require('./models/follows');
exports.Collections = require('./models/collections');
