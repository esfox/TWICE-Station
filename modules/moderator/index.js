const { Module } = require('discord-utils');
const { moderators } = require('config/config');

module.exports = class extends Module
{
  constructor()
  {
    super();
    this.setCommandsPath(`${__dirname}/commands`);
    this.rules.users = moderators;
  }
}