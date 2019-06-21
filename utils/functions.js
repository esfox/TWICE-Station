const simplify = string => string
  .toLowerCase()
  .trim()
  .replace(/\sand\s|\sn\s|\s\&\s|\&/g, 'and')
  .replace(/\s|!|\?|\\|\(|\)|\.|\-/g, '');

exports.compare = (item, query) => simplify(item).match(simplify(query));
exports.search = (items, query) => items.find(item => this.compare(item, query));

/** @param {number} seconds*/
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

/** @param {import('discord.js').TextChannel[]} channels */
exports.channelsText = channels => channels.length === 1?
	`#${channels.shift().name}` :
	channels.map((channel, i) => 
		i < channels.length - 1?
			`#${channel.name}${i === channels.length - 2? '' : ','}` :
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
  let user = asMember?
    mentions.members.first() :
    mentions.users.first();

  const { message } = context;
  if(!user)
    user = asMember?
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

  if(member.bot)
    return context.send("You can't add coins to bots.");

  if(parameters.length === 1)
    return context.send('How many coins to add?');
  parameters.splice(parameters.findIndex(word => word.includes(member.id)), 1);

  let amount = parameters.shift();
  if(isNaN(amount))
    return context.send("That's not a valid amount of coins.");
  amount = parseInt(amount);
  return { user: member, amount };
}
  