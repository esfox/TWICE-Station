const { Command } = require('discord-utils');
const { getChannelMentions, channelsText } = require('utils/functions');
const { Follows } = require('api/models');

/** @type {string[]} */
const { followables } = require('config/config');

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
    return context.send('❌  What channel/s to follow?');

  const ids = channels.map(channel => channel.id);
  if(ids.every(id => !followable(id)))
		return context.send(`❌  ${ids.length === 1?
      'That channel' : 'Those channels'} cannot be followed.`);

	const toFollow = ids.filter(followable);
  const followResult = await Follows.addToUser(context.message.author.id, toFollow);
  if(followResult === undefined)
      return context.send("Whoops. Something went wrong. Please try again.");

  const description = toFollow.map(channel => `<#${channel}>`).join(' ')
		+ `\n\nMedia posted on ${toFollow.length === 1?
      'this channel' : 'these channels'} will be DM'ed to you.`;
      
  const embed = context.embed('🔔  Followed...', description);

  const alreadyFollowed = channels.filter(({ id }) => !toFollow.includes(id));
	if(alreadyFollowed.length > 0)
    embed.setFooter('You have already followed' 
      + ` ${channelsText(alreadyFollowed)}.`);

  const unfollowables = channels.filter(({ id }) => !followable(id));
  if(unfollowables.length > 0)
    embed.setFooter(`${channelsText(unfollowables)} cannot be followed.`);
			
  context.chat(embed);
}

const followable = channel => followables.includes(channel);
