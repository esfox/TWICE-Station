const Sequelize = require('sequelize');
const { Model, Op } = require('sequelize');
const sequelize = new Sequelize
({
	dialect: 'sqlite',
	storage: `${__dirname}/cooldowns.sqlite`,
	logging: false
});

sequelize.sync()
	.then(_ => console.log('Cooldowns Database Ready.'))
	.catch(console.error);

class Cooldown extends Model { }
Cooldown.init(
{
	command: Sequelize.STRING,
	user: Sequelize.STRING,
	end_time: Sequelize.BIGINT
},
{
	sequelize,
	underscored: true,
	timestamps: false
});

const where = (command, user) =>
({
	[Op.and]:
	{
		command,
		user
	}
});

exports.get = async (command, user) =>
{
	const cooldown = await Cooldown.findOne(
	{
		where: where(command, user),
	}).catch(console.error);

	return cooldown? cooldown.end_time : undefined;
}

exports.add = (command, user, end_time) =>
{
	Cooldown.create({ command, user, end_time })
		.catch(console.error);
}

exports.update = async (command, user, end_time) =>
{
	await Cooldown.update({ end_time },
	{
		where: where(command, user)
	}).catch(console.error);
}

exports.reset = () => sequelize.query('delete from cooldowns');
