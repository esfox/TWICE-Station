const { Command } = require('discord-utils');
const { loadData, save } = require('data/saved');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'startraffle';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const data = await loadData();
  let { bank, raffle } = data;

  if(raffle.inProgress)
    return context.send("❌  There's already a raffle in progress.");

  let { parameters: prize } = context;
  if(!prize)
    return context.send('❌  Please enter the initial raffle prize.');
  prize = Math.abs(parseInt(prize));

  if(bank < prize)
    return context.send("❌  There isn't enough coins in the bank.");

  data.bank -= prize;
  data.raffle.inProgress = true;
  data.raffle.prize = prize;

  await save(data);
  context.send('💰  Raffle has been started',
    `Initial Prize: __**${prize}**__ TWICECOINS`);
}
