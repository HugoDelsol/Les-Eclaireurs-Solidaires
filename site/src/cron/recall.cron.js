const service = require('../services/recallService');

const rServ = new service.RecallService();

const stringVal = rServ.parseReadFile()

rServ.cronScript(stringVal);