const { Command } = require('discord-utils');
const { getChannelMentions, channelsText } = require('utils/functions');
const { User } = require('models');

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
  const userID = context.message.author.id;
  const channels = getChannelMentions(context);
  if(!channels || channels.length === 0)
    return context.send('❌  What channel/s to unfollow?');

  const ids = channels.map(channel => channel.id);
  const follows = await User.getFollows(userID);
  let notFollowed = ids.filter(id => !follows.includes(id));
  if(ids.every(id => notFollowed.includes(id)))
    return context.send(`❌  You are not following ${ids.length === 1?
      'that channel' : 'those channels'}.`);

  let unfollowed = follows.filter(follow => ids.includes(follow));
  const description = unfollowed.map(channel => `<#${channel}>`).join(' ');
  const embed = context.embed(`🔕  Unfollowed...`, description);

  notFollowed = channels.filter(channel => !unfollowed.includes(channel.id));
  if(notFollowed.length !== 0)
      embed.setFooter(`You are not following ${channelsText(notFollowed)}.`);

  await User.removeFollows(userID, unfollowed);
  context.chat(embed);
}