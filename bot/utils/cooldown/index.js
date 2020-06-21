class Command
{
	constructor(name, duration, isSaved)
	{
		this.name = name;
		this.duration = duration;
		this.isSaved = isSaved;
	}
}

const commands = {};

const saved = require('./data');
const cached = {};

// exports.get = commands;

/**
 * @param {string} name
 * @param {number} duration
 * @param {boolean} [persistent]
 */
exports.add = (name, duration, persistent) =>
{
	if(Object.keys(commands).includes(name))
		throw new Error(`${name} already has a cooldown set.`);

	commands[name] = new Command(name, duration * 1000, persistent);

	if(!persistent)
		return cached[name] = {};
}

/**
 * @param {string} command
 * @param {string} userID
 */
exports.check = async (command, userID) =>
{
	if(!command)
		throw new Error('Add the command first.');

	command = commands[command];

	const { name, duration, isSaved } = command;
	const now = Date.now();

	if(!isSaved)
	{
		const users = cached[name];
		let cooldownEnd = users[userID];
		if(Object.keys(users).some(key => key === userID))
		{
			if(now < cooldownEnd)
				return cooldownEnd - now;
		}
	
		users[userID] = now + duration;
		return;
	}
	
	let cooldownEnd = await saved.get(name, userID);
	if(!cooldownEnd)
		return saved.add(name, userID, now + duration);

	if(now < cooldownEnd)
		return cooldownEnd - now;

	cooldownEnd = now + duration;
	await saved.update(name, userID, cooldownEnd);
}

exports.reset = async command =>
{
	if(!command)
		throw new Error('Add the command first.');

	command = commands[command];
	const { name, isSaved } = command;

	if(!isSaved)
		return cached[name] = {};

	await saved.reset()
		.catch(console.error);3
}
