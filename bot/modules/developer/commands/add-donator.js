const { Command } = require('discord-utils');
const { writeFileSync } = require('fs');
const donators = require('data/donators.json');


module.exports = class extends Command
{
  constructor()
  {
    super();

    this.keyword = 'donator';
    this.action = action;
  }
}

/** @param {import('discord-utils').Context} context*/
async function action(context)
{
	if(! context.parameters)
		return context.send("Please include the action to do and the user's Discord ID.");

	const [ action, user ] = context.parameters;
	if(! context.guild.member(user))
		return context.send('That user is not in the server.');

	if(action === 'add')
	{
		if(donators.includes(user))
			return context.send('That user is already a donator.');
	
		donators.push(user);
		saveDonators();
		context.send('Donator has been added.');
	}

	if(action === 'rm')
	{
		if(! donators.includes(user))
			return context.send('That user is not a donator.');

		for(const i in donators)
		{
			if(donators[i] === user)
				donators.splice(i, 1);
		}

		saveDonators();
		context.send('Donator has been removed.');
	}
}

function saveDonators()
{
	writeFileSync('./bot/data/donators.json', JSON.stringify(donators));
}
