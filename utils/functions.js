exports.randomElement = array => 
  array[Math.floor(Math.random() * array.length)];

const simplify = string => string
  .toLowerCase()
  .trim()
  .replace(/\sand\s|\sn\s|\s\&\s|\&/g, 'and')
  .replace(/\s|!|\?|\\|\(|\)|\.|\-/g, '');

exports.compare = (text1, text2, exact) => 
{
  text1 = simplify(text1);
  text2 = simplify(text2);
  return exact? text1 === text2 : text1.match(text2);
}

exports.search = (items, query) => 
  items.find(item => this.compare(item, query));

exports.sleep = async seconds =>
  new Promise(resolve => setTimeout(_ => resolve(), seconds * 1000));

/**
 * @param {Array} array
 * @param {number} chunks
 * */
exports.chunk = (array, chunkSize) => array.reduce((chunks, item, i) =>
{
  i = Math.floor(i / chunkSize);
  if(!chunks[i])
    chunks[i] = [];

  chunks[i].push(item);
  return chunks;
}, []);

const cooldowns = require('utils/cooldown');

/** @param {import('discord-utils').Context} context*/
exports.onCooldown = async (context, command) =>
{
  let cooldown = await cooldowns.check(command, context.message.author.id);
  if(!cooldown)
    return;

  cooldown = cooldown / 1000;
  if(cooldown > 1)
    cooldown = ~~cooldown;
  context.reply(`❄  On cooldown, please wait ${cooldown} seconds.`);
  return true;
}

/**
 * @param {import('discord.js').Message} message 
 * @param {number} seconds 
 * @param {number} limit 
 */
exports.waitReplies = async (message, seconds, limit = 1) =>
{
	const options = { max: limit };
	if(seconds)
		options.time = seconds * 1000;

	const responses = await message.channel.awaitMessages(msg => 
    msg.author.id === message.author.id, options)
    .catch(console.error);
    
  return responses? 
    responses.array().map(({ content }) => content) : 
    [ undefined ];
}

exports.getTimeLeft = milliseconds =>
{
  const suffix = amount => amount !== 1 ? 's' : '';
  if(milliseconds < 60000)
  {
    const seconds = milliseconds >= 1000 ?
      Math.floor(milliseconds / 1000) : (milliseconds / 1000).toFixed(2);

    return `${seconds} second${suffix(seconds)}`;
  }

  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const seconds = Math.ceil((milliseconds / 1000) % 60);

  let timeLeft = `${(milliseconds / 1000).toFixed(2)}`
    + ` second${suffix(milliseconds)}`;
  if(seconds > 0)
    timeLeft = `${seconds} second${suffix(seconds)}`;
  if(minutes > 0)
    timeLeft = `${minutes} minute${suffix(minutes)} and ` + timeLeft;
  if(hours > 0)
    timeLeft = `${hours} hour${suffix(hours)}, ` + timeLeft;

  return timeLeft;
}

/** @param {import('discord.js').TextChannel[]} channels */
exports.channelsText = channels => channels.length === 1 ?
  `#${channels.shift().name}` :
  channels.map((channel, i) =>
    i < channels.length - 1 ?
      `#${channel.name}${i === channels.length - 2 ? '' : ','}` :
      `and #${channel.name}`)
    .join(' ');

/** @param {import('discord-utils').Context} context*/
const getMentions = context =>
{
  const { parameters } = context;
  if(!parameters)
    return;

  return context.message.mentions;
}

/** 
 * @param {import('discord-utils').Context} context
 * @param {boolean} [asMember]
 * */
exports.getMention = (context, asMember) =>
{
  const mentions = getMentions(context);
  if(!mentions)
    return;

  const findByID = user => context.parameters.includes(user.id);
  let user = asMember ?
    mentions.members.first() :
    mentions.users.first();

  const { message } = context;
  if(!user)
    user = asMember ?
      message.guild.members.find(findByID) :
      message.client.users.find(findByID);

  return user;
}

/** @param {import('discord-utils').Context} context*/
exports.getChannelMentions = context =>
{
  const mentions = getMentions(context);
  if(!mentions)
    return;

  return mentions.channels.array();
}

/** 
 * @typedef {object} Receiver
 * @property {import('discord.js').GuildMember} member
 * @property {number} amount
 * 
 * @param {import('discord-utils').Context} context
 * @returns {Receiver}
 * */
exports.getMentionAndAmount = context =>
{
  let parameters = context.parameters;
  const member = this.getMention(context, true);
  if(!member || !parameters)
    return context.send('Give coins to who?');

  if(member.user.bot)
    return context.send('Bots cannot have coins.');

  if(parameters.length === 1)
    return context.send('How many coins to add?');
  parameters.splice(parameters.findIndex(word => word.includes(member.id)), 1);

  let amount = parameters.shift();
  if(isNaN(amount))
    return context.send("That's not a valid amount of coins.");
  amount = parseInt(amount);
  return { member, amount };
}

/** @param {Array} array */
exports.getTop10 = (array, attribute) => array
  .sort((a, b) => b[attribute] - a[attribute])
  .filter(item => item[attribute] !== 0)
  .slice(0, 10);
