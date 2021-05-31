const { Module } = require('discord-utils');
const { developer, cbresetters } = require('config/config');

module.exports = class extends Module
{
  constructor()
  {
    super();
    this.setCommandsPath(`${__dirname}/commands`);
    this.rules.users.push(developer.id);
    this.rules.users.push(...cbresetters);
  }
}