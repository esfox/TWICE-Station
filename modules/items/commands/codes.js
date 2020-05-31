const { Command } = require('discord-utils');
const items = require('data/items');
const members = require('data/members');
const albums = require('data/music.json').albums;

/** @type {Object[]} */
const codeinfo = items.map(({ value, items }) =>
({
  title: value[0].toUpperCase() + value.substr(1) + ' Items',
  info: items.reduce((text, { code, name }) => 
    `${text}${code} - ${name}\n`, '')
}));

codeinfo.push(
({
  title: 'Members',
  info: members.reduce((text, { code, name }) =>
    `${text}${code} - ${name}\n`, '')
}));

codeinfo.push(
({
  title: 'Albums',
  info: Object.values(albums).reduce((text, { code, title }) =>
    `${text}${code} - ${title}\n`, '')
}));

const extrainfo = 
`• For **Nice** and **Amazing** items and **Plushies**, the code format is: 
\`(member code)-(item code)\`
Ex.
- \`ch-c\` (Chaeyoung Candy)
- \`sn-pc\` (Sana Photocard)
- \`ny-p\` (Nayeon Bunny Plushie)

• For **Albums**, the code format is: 
\`(album code)-a\`
Ex.
- \`tsb-a\` (The Story Begins Album)
- \`wil-a\` (What Is Love? Album)`;

const footer = 'The codes can be used in selling items'
 + ' and for the Wheel of TWICE game.';

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'codes';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  const embed = context.embed('🔡  Codes');
  codeinfo.forEach(({ title, info }) => 
    embed.addField(title, `${'```ml\n'}${info}${'\n```'}`, true));
  embed
    .addField('‍', extrainfo)
    .setFooter(footer);
  context.chat(embed);
}
