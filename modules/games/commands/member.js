const command = 'guessthemember';

const { Command } = require('discord-utils');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const quiz = require('../quiz');

const { cooldowns: cooldown, rewards } = require('config/config');
const { randomElement, onCooldown } = require('utils/functions');

const members = require('data/members');

const cooldowns = require('utils/cooldown');
cooldowns.add(command, cooldown.lyrics_guess);

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = command;
    this.aliases.push('gtm');
    this.action = action;
  }
}

const unnecessaryInfo =
[ 
  'twice members profile',
  'nationality',
  'stage name',
  'birth name',
  'blood type',
  'zodiac',
  'weight',
  'twitter',
  'instagram',
  'representative color',
  'show more',
  'older brother',
  'hanlim',
];

const misspelledNamesRegex = /Jungyeon|Chaeyeong|Ji-hyo/g;

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  if(await onCooldown(context, command))
    return;

  context.message.channel.startTyping();

  const member = randomElement(members);
  let html = await request('https://kprofiles.com/twice-members-profile');
  if(!html)
    return error(context);

  let $ = cheerio.load(html);
  let info = $(`.entry-content > p:contains("${member.hangul}")`).text();
  let facts = $(`.entry-content > p:contains("${member.name} Facts")`
    + ' a:contains("Show more")').prop('href');

  html = await request(facts);
  if(!html)
    return error(context);

  $ = cheerio.load(html);
  facts = $(`.entry-content > p:contains("${member.name} facts")`).text();
  info += `\n${facts}`;
  info = info.split('\n')
    .filter(_info => 
    {
      _info = _info.toLowerCase();
      const name = member.name.toLowerCase();
      const isValid =
        _info !== '' &&
        _info !== name &&
        !_info.match(`${name} facts`) &&
        unnecessaryInfo.every(item => !_info.match(item));
      return isValid;
    })
    .map(i => i.replace(/^– /g, ''));

  info = randomElement(info)
    .replace(new RegExp(member.name, 'g'), 'this member')
    .replace(misspelledNamesRegex, 'this member');
  info = info.charAt(0).toUpperCase() + info.substr(1).trim();

  const question = context.embed('👩  Guess the Member!', info);
  const extraInfo = 'Information from kprofiles.com';
  quiz(context, question, member.name, rewards.member_guess, extraInfo);
}

const request = link => fetch(link)
  .then(response => response.text())
  .catch(console.error);

/** @param {import('discord-utils').Context} context*/
function error(context)
{
  context.message.channel.stopTyping(true);
  context.send('❌ The command seems to be not working.',
    'https://kprofiles.com/twice-members-profile might be down.');
}
