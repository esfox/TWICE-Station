const { Context } = require('discord-utils');
const database = require('../data/database');
const functions = require('./functions');

module.exports = class extends Context
{
  constructor(bot)
  {
    super(bot);

    this.data = database;
    this.functions = functions;
  }
}