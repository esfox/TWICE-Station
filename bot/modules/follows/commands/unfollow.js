const { Command } = require('discord-utils');
const { getChannelMentions } = require('utils/functions');
const { Follows } = require('api/models');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'unfollow';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const channels = getChannelMentions(context);
  if(!channels || channels.length === 0)
    return context.send('❌  What channel/s to unfollow?');

  const toUnfollow = channels.map(({ id }) => id);
  const unfollowResult = await Follows.removeFromUser(context.message.author.id, toUnfollow);
  if(unfollowResult === undefined)
    return context.error("Whoops. Something went wrong. Please try again.");

  const unfollowedChannels = toUnfollow.map(channel => `<#${channel}>`).join(' ');
  context.send('🔕  Unfollowed...', unfollowedChannels);
}
