const config = require('./config/config.json');
const Discord = require('discord.js');
const bot = new Discord.Client();

const TwiceStationContext = require('twice-station-context');
const context = new TwiceStationContext(bot);
context.setModulesPath(`${__dirname}/modules`);

const database = require('./data/database');
const [ token ] = process.argv.slice(2);
bot
  .login(token)
  .catch(console.error);
  
const { client, channel } = config.developer;
let ping = '<@247955535620472844>';

bot.on('ready', async _ =>
{
  await database.init();
  console.log('Database connected.');
  console.log('Bot connected.');

  if(bot.user.id === client)
  {
    ping += '‍';
    config.prefixes = [ '`' ];
    config.embed_color = '#36393F';
  }

  context.setConfig(config);

  const pingChannel = bot.channels.get(channel);
  if(pingChannel)
    pingChannel.send(ping)
      .catch(console.error);
});

bot.on('message', message =>
{
  if(message.content === ping)
    message.delete();

  if(message.channel.type === 'dm' && 
    message.author.id !== context.config.developer.id)
    return;

  context.from(message);
});
