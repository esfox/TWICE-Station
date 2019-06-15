const { Command } = require('discord-utils');
const { getChannelMentions } = require('../../../utils/functions');
const { User } = require('../../../data/database');

/** @type {string[]} */
const followables = require('../../../config/followables.json');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'follow';
		this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const channels = getChannelMentions(context);
  if(!channels || channels.length === 0)
    return context.send('❌  What channel to follow?');

  const ids = channels.map(channel => channel.id);
  if(ids.every(notFollowable))
    return context.send(ids.length === 1?
      '❌  That channel cannot be followed.' :
      '❌  Those channels cannot be followed.');

	/** @type {string[]} */
	const followed = await User.addFollows(context.message.author.id, ids);
	if(!followed)
		return context.send('You have already followed'
			+ ` ${ids.length === 1? 'that channel' : 'those channels'}.`);

	const follows = ids.filter(id => !notFollowable(id));
	const unfollowables = channels.filter(channel => notFollowable(channel.id));
  const description = followed.map(channel => `<#${channel}>`).join(' ')
		+ `\n\nMedia posted on ${followed.length === 1?
			'this channel' : 'these channels'} will be DM'ed to you.`;
  const embed = context.embed('🔔  Followed...', description);

  if(unfollowables.length > 0)
    embed.setFooter(`${channelsText(unfollowables)} cannot be followed.`);

	if(follows.length > followed.length)
		embed.setFooter(`You have already followed ${channelsText(channels
			.filter(channel => !followed.includes(channel.id)))}.`)
			
  context.chat(embed);
}

const notFollowable = channel => !followables.includes(channel);

/** @param {string[]} channels */
const channelsText = channels => channels.length === 1?
	`#${channels.shift().name}` :
	channels.map((channel, i) => 
		i < channels.length - 1?
			`#${channel.name}${i === channels.length - 2? '' : ','}` :
			`and #${channel.name}`)
	.join(' ');