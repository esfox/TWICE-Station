const { readdirSync } = require('fs');
module.exports = sequelize => readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .reduce((models, model) =>
  {
    modelName = model[0].toUpperCase() + model.substr(1).replace('.js', '');
    model = require(`${__dirname}/${model}`).init(sequelize);
    models[modelName] = model;
    return models;
  }, {})
