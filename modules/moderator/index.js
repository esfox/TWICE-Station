const { Module } = require('discord-utils');
const { developer } = require('config/config');

module.exports = class extends Module
{
  constructor()
  {
    super();
    this.setCommandsPath(`${__dirname}/commands`);
    this.rules.users = [ developer.id, '558209818892959744' ];
  }
}