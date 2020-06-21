const fs = require('fs');

const logFolder = './logs';

const Types =
{
  INFO: 'INFO',
  ERROR: 'ERROR',
};

const Tokens =
{
  TIMESTAMP: '%timestamp%',
  TYPE: '%type%',
  MESSAGE: '%message%',
};

const format = `[%timestamp%] %type% | %message%`;

class Logger
{
  constructor()
  {
    if(!fs.existsSync(logFolder))
      fs.mkdirSync(logFolder);
  }

  info(message)
  {
    if(!message)
      return;

    log(format
      .replace(Tokens.TYPE, Types.INFO.padEnd(5, ' '))
      .replace(Tokens.MESSAGE, message)
    );
  }

  error(message)
  {
    if(!message)
      return;

    log(format
      .replace(Tokens.TYPE, Types.ERROR.padEnd(5, ' '))
      .replace(Tokens.MESSAGE, message)
    );
  }
}

function log(output)
{
  const pad = string => string.toString().padStart(2, '0');

  const now = new Date();
  const hour = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  
  const month = pad(now.getMonth());
  const date = pad(now.getDate());
  const year = pad(now.getFullYear());

  const logFile = `./${logFolder}/${month}-${date}-${year}.log`;
  const timestamp = `${hour}:${minutes}:${seconds}`;
  output = output.replace(Tokens.TIMESTAMP, timestamp);
  fs.appendFileSync(logFile, `${output}\n`, 'utf-8');
}

exports.Logger = new Logger();
