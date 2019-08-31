const { readFile, writeFile } = require('fs');
const { promisify } = require('util');
const read = promisify(readFile);
const save = promisify(writeFile);

const file = `${__dirname}/saved.json`;

exports.loadData = async _ =>
{
  let data = await read(file);
  if(!data)
    throw new Error("Can't read data file.");

  data = JSON.parse(data);
  return data;
}

exports.save = async data =>
{
  data = JSON.stringify(data, null, 2);
  await save(file, data);
}
