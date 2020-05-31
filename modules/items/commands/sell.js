const { Command } = require('discord-utils');
const { compare } = require('utils/functions');
const itemList = require('data/items');
const collections = require('data/collections');
const { masterList: items, checkForCollections } = require('../item');
const { User } = require('database');

const values = itemList.map(({ value }) => value);

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'sell';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  new Seller(context);
}

class Seller
{
  /** @param {import('discord-utils').Context} context*/
  constructor(context)
  {
    this.context = context;
    this.sell();
  }

  async sell()
  {
    const context = this.context;
    let { raw_parameters: args } = context;
    if(!args)
      return context.send('❌  What to sell?');

    let amount;
    if(args.includes('='))
    {
      const equalSign = args.indexOf('=');
      amount = parseInt(args.substring(equalSign + 1));
      args = args.replace(args.substring(equalSign), '');
    }

    this.userID = context.message.author.id;
    this.userItems = await User.getItems(this.userID);
    if(!this.userItems)
      return context.send("❌  You don't have items.");

    if(args === 'all')
      return this.sellAll();

    if([ 'duplicate', 'duplicates', 'dup', 'dups' ].includes(args))
      return this.sellDuplicates();

    const value = values.find(value => compare(args, value, true));
    if(value)
      return this.sellByValue(value);

    const collection = collections.find(({ name }) =>
      compare(args, name, true));
    if(collection)
      return this.sellByCollection(collection);

    const item = items.find(({ name, code }) =>
      compare(args, name, true) || compare(args, code, true))
    if(item)
      return this.sellByItem(item, amount);

    context.reply("❌  Can't find that item.");
  }

  async save()
  {
    await User.setItems(this.userID, this.userItems);
    await User.addCoins(this.userID, this.earn);
  }

  respond(response)
  {
    this.context.reply(`💰  ${response}`,
      `for __**${this.earn}**__ **TWICECOINS**`);
  }

  async sellAll()
  {
    this.earn = items.reduce((earn, { code, cost }) =>
      earn + ((this.userItems[code] || 0) * cost), 0);
    this.userItems = {};

    await this.save();
    this.respond('You sold all items');
  }

  async sellDuplicates()
  {
    this.earn = items.reduce((earn, { code, cost }) =>
    {
      const itemCount = this.userItems[code];
      if(!itemCount || itemCount <= 1)
        return earn;

      if(this.userItems[code])
        this.userItems[code] = 1;

      return earn + ((itemCount - 1) * cost);
    }, 0);

    if(this.earn === 0)
      return this.context.send("❌  You don't have duplicate items.");

    await this.save();
    this.respond('You sold all duplicate items');
  }

  async sellByValue(value)
  {
    this.earn = items.reduce((earn, { code, cost, value: itemValue }) =>
    {
      if(itemValue !== value || !Object.keys(this.userItems).includes(code))
        return earn;

      earn = earn + (this.userItems[code] * cost);
      delete this.userItems[code];
      return earn;
    }, 0);

    if(this.earn === 0)
      return this.context.send(`❌  You don't have any ${value} items.`);

    await this.save();
    value = value.charAt(0).toUpperCase() + value.substr(1);
    this.respond(`You sold all ${value} items.`);
  }

  async sellByCollection(collection)
  {
    if(!collection.items.every(item =>
      Object.keys(this.userItems).includes(item)))
      return this.respond("❌  You haven't completed that collection.");

    this.earn = items.reduce((earn, { code, cost }) =>
    {
      if(!collection.items.includes(code))
        return earn;

      earn = earn + (this.userItems[code] * cost);
      delete this.userItems[code];
      return earn;
    }, 0);

    await checkForCollections(this.context.message.author.id,
      this.userItems, true);
    await this.save();

    this.respond(`You sold all items from the ${collection.name} collection`);
  }

  async sellByItem(item, amount = 1)
  {
    const { code, cost } = item;
    if(!Object.keys(this.userItems).includes(code))
      return this.context.send("❌  You don't have that item.");

    const itemCount = this.userItems[code];
    if(amount > itemCount)
      amount = itemCount;

    if(amount === itemCount)
      delete this.userItems[code];
    else
      this.userItems[code] -= amount;

    this.earn = amount * cost;

    await this.save();
    this.respond(`You sold ${amount > 1? `${amount} `: ''}${item.name}`);
  }
}
