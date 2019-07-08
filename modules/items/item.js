const values = require('data/items').sort((a, b) => a.chance - b.chance);
const members = require('data/members');
const { albums } = require('data/music.json');
const { randomElement } = require('utils/functions');
const { User } = require('models');

const itemList = values.reduce((list, { items }) => list.concat(items), []);

const getValue = code =>
{
  const value = values
    .find(({ items }) => items.some(({ code: _code }) => _code === code));
  const { name, text, chance, cost } = value;
  return { name, text, chance, cost };
}

const getBaseItem = code =>
{
  const itemValue = getValue(code);
  const { name: value, text: valueText, cost } = itemValue;
  const item = itemList.find(({ code: _code }) => _code === code);
  item.value = value;
  item.valueText = valueText;
  item.cost = cost;
  return item;
}

const parseItemDisplayInfo = item =>
{
  const { name, value, cost } = item;
  return { name, value, cost };
}

/** @param {string} code */
exports.getItemDisplayInfo = code =>
{
  if(!code.includes('-'))
    return parseItemDisplayInfo(getBaseItem(code));

  const [ extraCode, baseCode ] = code.split('-');
  const item = { ...getBaseItem(baseCode) };
  if(item.ofMember)
  {
    const member = members.find(({ code }) => code === extraCode);
    item.name = member.name
      + `${item.code === 'p'? ` ${member.animal}` : ''} ${item.name}`;
  }
  if(item.ofAlbum)
  {
    const album = Object.values(albums).find(({ code }) => code === extraCode);
    item.name = `${album.title} ${item.name}`;
  }

  return parseItemDisplayInfo(item);
}

exports.getRandomItem = _ =>
{
  const rng = Math.random() * 100;
  const value = values.find(({ chance }) => rng <= chance);
  if(!value)
    return;

  const item = { ...getBaseItem(randomElement(value.items).code) };
  const noEmote = !item.emote;
  if(item.ofMember)
  {
    const member = randomElement(members);
    if(noEmote)
      item.emote = member.emote;

    const code = item.code;
    item.image = 
      code === 'pc'?
        member.photocard :
      code === 'ps'?
        member.poster :
      code === 'lv'?
        member.lovely :
        undefined;
     
    item.name = member.name
      + `${noEmote? ` ${member.animal}` : ''} ${item.name}`;
    item.code = `${member.code}-${item.code}`;
  }
  else if(item.ofAlbum)
  {
    const album = randomElement(Object.values(albums));
    item.image = album.cover;
    item.name = `${album.title} ${item.name}`;
    item.code = `${album.code}-${item.code}`;
  }

  return item;
}

exports.addItemToUser = async (user_id, code) =>
{
  const bag = await User.getItems(user_id) || {};
  let item = bag[code];
  if(!item)
    item = 0;

  bag[code] = item + 1;
  return await User.setItems(user_id, bag);
}
