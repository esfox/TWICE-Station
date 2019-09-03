const { developer } = require('config/config');

const commands =
{
  report: 0,
  suggest: 1,
};

/** @param {import('discord-utils').Context} context */
exports.report = context => notice(commands.report, context);
exports.suggest = context => notice(commands.suggest, context);

/** @param {import('discord-utils').Context} context */
function notice(command, context)
{
  const { raw_parameters } = context;
  if(!raw_parameters)
    return context.send(command === commands.report?
      '❌  Report what problem?' : '❌  Suggest what feature?');

  const report = context.embed(command === commands.report?
    '❕  Report Submitted' : '💡  Suggestion Submitted', raw_parameters)
    .setFooter(`Submitted by: ${context.message.author.username}`);

  context.send(`✅  ${command === commands.report?
    'Report' : 'Suggestion'} has been submitted.`);
  context.bot.users.get(developer.id).send(report);
}
