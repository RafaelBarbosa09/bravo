import CreateCurrency from "../../application/usecases/CreateCurrency";
import GetCurrencies from "../../application/usecases/GetCurrencies";
import HttpServer from "../http/HttpServer";
import PopulateCurrencies from "../../application/usecases/PopulateCurrencies";

class CurrencyController {
    constructor(readonly httpServer: HttpServer, getCurrencies: GetCurrencies, createCurrency: CreateCurrency, populateCurrencies: PopulateCurrencies) {
        httpServer.register('get', '/currencies', async () => {
            return await getCurrencies.execute();
        });

        httpServer.register('post', '/currencies/populate', async () => {
            return await populateCurrencies.execute();
        });

        httpServer.register('post', '/currencies', async (body: any) => {
            return await createCurrency.execute(body);
        });
    }
}

export default CurrencyController;