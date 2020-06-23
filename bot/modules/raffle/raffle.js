const { loadData, save } = require('data/saved');
const { raffle_fee } = require('config/config');
const { Coins } = require('api/models');

class Raffle
{
  /** @param {import('discord-utils').Context} context */
  constructor(context, raffle)
  {
    this.context = context;
    this.raffle = raffle;
  }

  async join()
  {
    const user = this.context.message.author.id;
    if(this.raffle.participants.includes(user))
      return this.context.reply('❌  You have already joined the raffle.');

    const userCoins = await Coins.ofUser(user);
    if(userCoins < raffle_fee)
      return this.context
        .reply("❌  You don't have enough TWICECOINS to join.");

    const feePaymentResult = await Coins.subtractFromUser(user, raffle_fee);
    if(feePaymentResult === undefined)
      return this.context.send("Whoops. Couldn't join the raffle. Please try again.");
      
    this.raffle.participants.push(user);
    update(this.raffle);

    this.context.reply('🎫  You have joined the Raffle');
  }

  prize()
  {
    this.context.send('💰 Raffle Prize',
      `__**${this.raffle.prize}**__ TWICECOINS`);
  }

  participants()
  {
    let { participants } = this.raffle;
    participants = participants
      .map(participant =>
      {
        participant = this.context.guild.member(participant);
        return participant? participant.displayName : undefined;
      })
      .filter(participant => participant);

    if(participants.length === 0)
      return this.context.send('There are no raffle participants yet.');

    participants = participants
      .reduce((text, participant) => text + `• ${participant}\n`, '');
    this.context.send('🎫  Raffle Participants', participants);
  }
}

module.exports = async context =>
{
  const { raffle } = await loadData();
  if(!raffle.inProgress)
    return context.send("There's no raffle in progress.");

  return new Raffle(context, raffle);
};

async function update(raffle)
{
  const data = await loadData();
  data.raffle = raffle;
  save(data);
}
