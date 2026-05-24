const cron = require('node-cron');
const { RecallService } = require('../services/recallService');

function startCron() {
    
    cron.schedule('0 8,18 * * *', async () => {
        
        try {
            console.log('Éxecution du cron interne...');

            const recallService = new RecallService();

            const stringVal = await recallService.parseReadFile();

            await recallService.cronScript(stringVal);

        } catch (error) {

            console.log("Erreur lors de l'exécution du cron : ", error);
        }
    });
}

module.exports = { startCron };