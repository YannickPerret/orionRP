(() => {
  const { v4: uuidv4 } = require('uuid');
  const crypto = require('node:crypto');
  require('dotenv').config()
  
  
  
  const cryptHash = (string) => {
    return crypto.createHash('sha256', process.env(HASH_CRYO)).update(string).digest('hex');
  }
  
  const Delay = (ms) => {
    return new Promise(res => {
      setTimeout(res, ms);
    });
  }
  
  exports('uuid', uuidv4());
  exports('cryptHash', cryptHash);
  exports('Delay', Delay);
})()

