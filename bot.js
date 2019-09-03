const config = require('./config/config');
const Discord = require('discord.js');
const bot = new Discord.Client();

const { Context } = require('discord-utils');
const context = new Context(bot);
context.setModulesPath(`${__dirname}/modules`);

const database = require('database');
const { loadData } = require('data/saved');

const { sleep, chunk } = require('utils/functions');
const musicPlayer = require('./modules/radio/player');
const cbreset = require('./modules/candybongs/cbreset');

let { client, channel, ping } = config.developer;
const { followables, followable_media } = config;

const [ token ] = process.argv.slice(2);
bot
  .login(token)
  .catch(console.error);

bot.on('ready', async _ =>
{
  await database.init();
  console.log('Database connected.');
  console.log('Bot connected.');

  musicPlayer.init(bot);
  cbreset.automate(bot);

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

  bot.user.setActivity('TWICE music videos', { type: 'WATCHING' });
});

bot.on('message', async message =>
{
  if(message.content === ping)
    message.delete();

  if(message.channel.type === 'dm' && 
    message.author.id !== context.config.developer.id)
    return;

  if(message.guild.id !== config.twicepedia)
    return;

  if(followables.includes(message.channel.id))
    return sendToFollowers(message);

  if((await loadData()).raffle.isDrawing)
    return;

  context.from(message);
});

/** @param {import('discord.js').Message} message */
async function sendToFollowers(message)
{
  await sleep(1);

  const attachments = message.attachments.array()
    .filter(attachment => attachment.width > 1 && attachment.height > 1)
    .map(attachment => attachment.url);

  const embeds = message.embeds
    .filter(embed => 
      followable_media.includes(embed.type) || embed.video || embed.image)
    .map(embed => embed.url);

  let links = [ ...attachments, ...embeds ];
  if(links.length === 0)
    return;
  links = chunk(links, 5);
  
  let followers = await database.Follows
    .getChannelFollowers(message.channel.id, message.author.id);
  followers = message.guild.members.array()
    .filter(({ id }) => followers.includes(id));

  for(const follower of followers)
  {
    links.forEach(content => follower.send('`Message link:` ' 
      + `${message.url}\n\n${content.join('\n')}`)
      .catch(console.error));
  }
}
