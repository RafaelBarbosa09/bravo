import CreateCurrency from "../../application/usecases/CreateCurrency";
import GetCurrencies from "../../application/usecases/GetCurrencies";
import HttpServer from "../http/HttpServer";

class CurrencyController {
    constructor(readonly httpServer: HttpServer, getCurrencies: GetCurrencies, createCurrency: CreateCurrency) {
        httpServer.register('get', '/currencies', async () => {
            return await getCurrencies.execute();
        });
        httpServer.register('post', '/currencies', async (body: any) => {
            return await createCurrency.execute(body);
        });
    }
}

export default CurrencyController;