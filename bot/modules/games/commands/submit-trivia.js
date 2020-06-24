const { Command } = require('discord-utils');
const { writeFileSync } = require('fs');
const { Logger } = require('utils/logger');
const { trivia_approver, prefixes } = require('config/config');
const trivias = require('data/trivias.json');

module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'trivia-submit';
    this.aliases.push('t-submit');
    this.action = action;
  }
}

/** @param {string} string */
const cleanString = string => string.trim().replace(/\s{2}/g, ' ');

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  let { raw_parameters } = context;

  const submitter = context.message.author;
  context.message.delete();
  
  if(!raw_parameters || !raw_parameters.includes(':') || !raw_parameters.includes('='))
  {
    const prefix = prefixes[0];
    const errorMessage = context.embed(
      '❌  Please follow the correct format for submitting trivias.',
      `${prefix}t-submit (question) : (atleast 2 choices) = (number of answer)\n\n`
      + 'The choices should be comma-separated.\n'
    ).addField(
      'Example',
      `\`${prefix}t-submit Who is the best member? : Sana, Nayeon, Mina, Jihyo = 2\``
    );

    return context.message.reply(errorMessage);
  }
      
  const choices = raw_parameters
    .match(/(?<=:).*(?=\=)/g)
    .shift()
    .split(',')
    .map(choice => cleanString(choice));

  if(choices.length < 3)
    return context.reply('❌  Not enough choices given.');
  
  let answer = parseInt(
    raw_parameters
      .match(/(?<=\=).*/g)
      .shift()
  );
  
  if(![ 1, 2, 3, 4 ].includes(answer))
    return context.reply('❌  The answer should be the number of the correct choice.');
  
  answer = choices[answer - 1];

  const question = cleanString(
    raw_parameters
      .match(/.*(?=:)/g)
      .shift()
  );

  if(!question || question === '')
    return context.reply('❌  Please include the question.');

  let submission = context.embed('📌  Trivia has been submitted.')
    .addField('Question', `**${question}**`)
    .addField('Choices', choices.join('\n'))
    .addField('Answer', `__**${answer}**__`);

  Logger.info(`Trivia submitted.\nQuestion: ${question}\nChoices: ${choices}\nAnswer: ${answer}`);
  
  await context.reply(
    '📌  Your trivia has been submitted and is waiting for approval.',
    'You will be notified when your trivia has been approved or rejected.'
  );

  const verifier = context.guild.member(trivia_approver);
  submission = await verifier.send(submission);
  await submission.react('✅');
  await submission.react('❌');

  const botID = context.bot.user.id;
  const reactionFilter =  (reaction, user) =>
    [ '✅', '❌' ].includes(reaction.emoji.name) && user.id !== botID;

  const reactions = await submission.awaitReactions(
    reactionFilter,
    { max: 1, time: 86400000 },
  );

  // const reactedUser = reactions.first().users.keyArray().find(user => user !== botID);
  const reaction = reactions.firstKey();
  const approved = reaction === '✅';

  if(approved)
  {
    const trivia =
    {
      number: `${trivias.length + 1}`,
      question,
      choices,
      answer,
    };

    trivias.push(trivia);
    writeFileSync('./bot/data/trivias.json', JSON.stringify(trivias, null, 2), 'utf-8');
  }

  const verificationNotif = context.embed(
    `${approved ? '✅' : '❌'}  Your trivia has been ${approved ? 'approved' : 'rejected'}.`,
    `"${question}"` + (!approved ? `\n\nYou can ask <@${trivia_approver}> why.` : '')
  );
  
  await submitter.send(verificationNotif);
  
  const verifierResponse = context.embed('✅  The trivia submitter has been notified.');
  verifier.send(verifierResponse);
}
