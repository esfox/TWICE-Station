const { Command } = require('discord-utils');
const { sleep, randomElement } = require('utils/functions');
const { raffle_prize_distribution } = require('config/config');
const { loadData, save } = require('data/saved');
const { Coins } = require('api/models');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'raffledraw';
    this.action = action;
  }
}

const winnerCount = 3;

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const data = await loadData();
  const { raffle } = data;
  let { inProgress, participants, prize } = raffle;
  if(!inProgress)
    return context.send("❌  There's no raffle in progress.");

  if(participants.length === 0)
    return context.send("❌  There are no raffle participants yet.");

  if(participants.length <= winnerCount)
    return context.send("❌  There are too few particiants.");

  const prizes = raffle_prize_distribution.map(percentage =>
    Math.round(prize * percentage));
  prizes.push(prizes.reduce((sum, p) => sum - p, prize));

  prize = prize / winnerCount;

  const winners = new Array(winnerCount).fill(0).reduce((winners, _, i) =>
  {
    participants = participants
      .map(participant => context.guild.member(participant))
      .filter(participant => participant &&
        !winners.some(({ user }) => participant.id === user.id));

    const winner = 
    {
      place: [ '1st', '2nd', '3rd' ][i],
      user: randomElement(participants),
      prize: prizes[i]
    }

    return winners.concat(winner);
  }, []);

  data.raffle.isDrawing = true;
  await save(data);

  for(const { place, user, prize } of winners)
  {
    context.send(`📥  Drawing ${place} winner...`);
    await sleep(5);
        
    context.send(`And the ${place} winner is...`);
    await sleep(3);

    context.chat(`<@${user.id}>! You win __**${prize}**__ TWICECOINS! 🎉`);
    const rewardResult = await Coins.addToUser(user.id, prize);
    if(rewardResult === undefined)
      context.error(`Whoops. Something went wrong with giving coins to <@${user.id}>.`
        + `Please ask a moderator to manually give the reward. (${prize} twicecoins)`);
    await sleep(2);
  }

  await context.send('🎉 Congratulations to all the winners! 🎉');

  data.raffle.isDrawing = false;
  data.raffle.inProgress = false;
  data.raffle.prize = 0;
  data.raffle.participants = [];
  await save(data);
}
