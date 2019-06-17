const { Command } = require('discord-utils');

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

/** @param {import('utils/TwiceStationContext')} context*/
async function action(context)
{
  const { getChannelMentions, channelsText } = context.functions;
  const { User } = context.data;

  const channels = getChannelMentions(context);
  if(!channels || channels.length === 0)
    return context.send('❌  What channel/s to follow?');

  const ids = channels.map(channel => channel.id);
  if(ids.every(id => !followable(id)))
		return context.send(`❌  ${ids.length === 1?
      'That channel' : 'Those channels'} cannot be followed.`);

	const toFollow = ids.filter(followable);
	const followed = await User.addFollows(context.message.author.id, toFollow);
	if(!followed)
		return context.send('You have already followed'
			+ ` ${ids.length === 1? 'that channel' : 'those channels'}.`);
  const description = followed.map(channel =>   `<#${channel}>`).join(' ')
		+ `\n\nMedia posted on ${followed.length === 1?
      'this channel' : 'these channels'} will be DM'ed to you.`;
      
  const embed = context.embed('🔔  Followed...', description);

  const alreadyFollowed = channels.filter(({ id }) => !followed.includes(id));
	if(alreadyFollowed.length > 0)
    embed.setFooter('You have already followed' 
      + ` ${channelsText(alreadyFollowed)}.`);

    const unfollowables = channels.filter(({ id }) => !followable(id));
  if(unfollowables.length > 0)
    embed.setFooter(`${channelsText(unfollowables)} cannot be followed.`);
			
  context.chat(embed);
}

const followable = channel => followables.includes(channel);
