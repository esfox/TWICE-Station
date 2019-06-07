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

const simplify = string => string
  .toLowerCase()
  .trim()
  .replace(/\sand\s|\sn\s|\s\&\s|\&/g, 'and')
  .replace(/\s|!|\?|\\/g, '');

exports.search = (items, query) => 
  items.find(item => simplify(item).match(simplify(query)));