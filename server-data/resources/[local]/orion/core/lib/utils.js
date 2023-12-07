const { v4: uuidv4 } = require('uuid');
const crypto = require('node:crypto');
require('dotenv').config()


exports('uuid', uuidv4);

exports('cryptHash', cryptHash);
const cryptHash = (string) => {
  return crypto.createHash('sha256', process.env(HASH_CRYO)).update(string).digest('hex');
}

