const Discord = require('discord.js');
const bot = new Discord.Client();

const { Context } = require('discord-utils');
const context = new Context(bot);
context.setModulesPath(`${__dirname}/modules`);

const [ token ] = process.argv.slice(2);
bot
  .login(token)
  .catch(console.error);

bot.on('ready', _ =>
{
  console.log('Bot connected.');
});

bot.on('message', message =>
{
  context.from(message);
});
