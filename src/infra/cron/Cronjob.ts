import { schedule } from 'node-cron';
import Logger from '../../application/logger/Logger';

class Cronjob {
    logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    public start() {
        this.updateExchangeRates();
    }

    private updateExchangeRates() {
        schedule('* * * * *', () => {
            this.logger.info(`Executando tarefa programada: ${new Date().toISOString()}`);
        });
    }
}

export default Cronjob;