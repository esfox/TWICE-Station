const simplify = string => string
  .toLowerCase()
  .trim()
  .replace(/\sand\s|\sn\s|\s\&\s|\&/g, 'and')
  .replace(/\s|!|\?|\\|\(|\)|\.|\-/g, '');

exports.compare = (item, query) => simplify(item).match(simplify(query));
exports.search = (items, query) => items.find(item => this.compare(item, query));

/** @param {import('discord-utils').Context} context*/
const getMentions = context =>
{
  const { parameters } = context;
  if(!parameters)
    return;
  
  return context.message.mentions;
}

/** @param {import('discord-utils').Context} context*/
exports.getMention = (context, asMember) =>
{
  const mentions = getMentions(context);
  if(!mentions)
    return;

  const findByID = user => parameters.includes(user.id);
  let user = asMember?
    mentions.members.first() :
    mentions.users.first();

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

/** @param {import('discord.js').TextChannel[]} channels */
exports.channelsText = channels => channels.length === 1?
	`#${channels.shift().name}` :
	channels.map((channel, i) => 
		i < channels.length - 1?
			`#${channel.name}${i === channels.length - 2? '' : ','}` :
			`and #${channel.name}`)
	.join(' ');
