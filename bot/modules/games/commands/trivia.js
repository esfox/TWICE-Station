const command = 'trivia';

const { Command } = require('discord-utils');
const { quiz } = require('../quiz');

const { cooldowns: cooldown, rewards } = require('config/config');
const { randomElement, onCooldown } = require('utils/functions');
const trivias = require('data/trivias');

const cooldowns = require('utils/cooldown');
cooldowns.add(command, cooldown.lyrics_guess);

module.exports = class extends Command
{
  constructor()
  {
    super(command);

    this.aliases.push('t');
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
  if(await onCooldown(context, command))
    return;

  let { number, question, choices, answer } = randomElement(trivias);
  const choicesText = '```css\n'
    + choices.reduce((text, choice, i) => `${text}[${i + 1}] ${choice}\n`, '')
    + '```';
  
  question = context
    .embed(`📝  Trivia #${number}`)
    .addField(question, choicesText);
  answer = (choices.indexOf(answer) + 1).toString();

  quiz(context, question, answer, rewards.trivia);
}
