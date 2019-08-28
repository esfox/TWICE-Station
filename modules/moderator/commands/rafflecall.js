const { Command } = require('discord-utils');
const { loadData } = require('data/saved');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'rafflecall';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const { raffle } = await loadData();
  const { inProgress, participants } = raffle;
  if(!inProgress)
    return context.send("❌  There's no raffle in progress.");

  if(participants.length === 0)
    return context.send("❌  There are no raffle participants yet.");

  const message = '📣 You were called for the **Raffle Draw**.\n\n'
    + participants.reduce((text, participant) =>
      text + `<@${participant}> `, '');
  context.chat(message);
}
