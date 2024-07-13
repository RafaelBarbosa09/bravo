import { schedule } from 'node-cron';
import Logger from '../../application/logger/Logger';
import UpdateExchangeRates from "../../application/usecases/UpdateExchangeRates";
import GetExchangeRates from "../../application/usecases/GetExchangeRates";
import {CurrencyType} from "../../utils/@types/Currency";

class Cronjob {
    logger: Logger;
    getExchangeRates: GetExchangeRates;
    updateExchangeRates: UpdateExchangeRates;

    constructor(logger: Logger, getExchangeRates: GetExchangeRates, updateExchangeRates: UpdateExchangeRates) {
        this.logger = logger;
        this.getExchangeRates = getExchangeRates;
        this.updateExchangeRates = updateExchangeRates;
    }

    public start() {
        this.updateExchangeRatesJob();
    }

    private updateExchangeRatesJob() {
        schedule('0 0 * * *', async () => {
            this.logger.info(`Executando tarefa programada: ${new Date().toISOString()}`);
            const { data } = await this.getExchangeRates.execute();
            await this.updateExchangeRates.execute(data as CurrencyType[]);
        });
    }
}

export default Cronjob;