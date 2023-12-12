(() => {
  const { v4: uuidv4 } = require('uuid');
  const crypto = require('node:crypto');
  require('dotenv').config()
  
  const uuid = uuidv4();
  
  const cryptHash = (string) => {
    return crypto.createHash('sha256', process.env(HASH_CRYO)).update(string).digest('hex');
  }
  
  const delay = (ms) => {
    return new Promise(res => {
      setTimeout(res, ms);
    });
  }
  
  exports('uuid', uuid);
  exports('cryptHash', cryptHash);
  exports('delay', delay);
})()

