const values = require('data/items').sort((a, b) => a.chance - b.chance);
const members = require('data/members');
const collections = require('data/collections');
const { albums } = require('data/music.json');
const { randomElement } = require('utils/functions');
const { Coins, Collections } = require('api/models');

const itemList = values.reduce((list, { items }) => list.concat(items), []);
const masterList = values.reduce((list, { value, items, cost }) => 
  list.concat(items.reduce((itemObjects, item) =>
  {
    const { code, name } = item;
    let itemObject = { code, name, value, cost };

    if(item.ofMember)
      itemObject = members.map(member =>
      ({
        code: `${member.code}-${code}`,
        name: `${member.name} ${item.ofAnimal? `${member.animal} `:''}${name}`,
        cost,
        value,
      }));
    
    if(item.ofAlbum)
      itemObject = Object.values(albums).map(album =>
      ({
        code: `${album.code}-${code}`,
        name: `${album.title} ${name}`,
        cost,
        value,
      }));

    return itemObjects.concat(itemObject);
  }, [])), []);

exports.masterList = masterList;

const getValue = code =>
{
  const value = values.find(({ items }) => items.some(({ code: _code }) => _code === code));
  const { value: name, text, chance, cost } = value;
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
  if(item.ofMember)
  {
    const member = randomElement(members);
    if(!item.emote)
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
      + `${item.ofAnimal? ` ${member.animal}` : ''} ${item.name}`;
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

exports.checkForCollections = async (user_id, items, toRemove) =>
{
  items = Object.keys(items);

  let completedCollections = collections.filter(({ items: collectionItems }) =>
    collectionItems.every(item => items.includes(item)));

  const userCollections = await Collections.ofUser(user_id);
  if(toRemove)
  {
    // newCollections = newCollections.length > 0? newCollections : [];
    if(userCollections.length > 0)
      await Collections.set(user_id, completedCollections.map(({ code }) => code));
    return;
  }

  if(userCollections)
    completedCollections = completedCollections.filter(({ code }) => 
      !userCollections.includes(code));

  if(completedCollections.length > 0)
  {
    await Collections.set(user_id,
      completedCollections.map(({ code }) => code).concat(userCollections));

    const bonus = completedCollections.reduce((sum, { bonus }) => sum + bonus, 0);
    await Coins.addToUser(user_id, bonus);
  }

  return completedCollections;
}
