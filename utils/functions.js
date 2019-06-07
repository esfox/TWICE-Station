/** @param {import('discord-utils').Context} context*/
exports.getMention = (context, asMember) =>
{
  const { parameters } = context;
  if(!parameters)
    return;

  const findByID = user => parameters.includes(user.id);
  
  const { message } = context;
  const { mentions } = message;
  let user = asMember?
    mentions.members.first() :
    mentions.users.first();
  if(!user)
    user = asMember?
      message.guild.members.find(findByID) :
      message.client.users.find(findByID);

  return user;
}