const { Command } = require('discord-utils');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'donate';
    this.action = action;
  }
}

const donateURL = 'https://www.paypal.com/cgi-bin/webscr?'
  + 'cmd=_s-xclick&hosted_button_id=LGYUCRUV5DBU6&source=url';

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  context.send('💬  Please check my message.');
  const embed = context
    .embed(undefined, `Donate on Paypal [here](${donateURL}).`);
  context.message.author.send(embed);
}