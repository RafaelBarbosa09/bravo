import GetCurrencies from "../../application/usecases/GetCurrencies";
import HttpServer from "../http/HttpServer";

class CurrencyController {
    constructor(readonly httpServer: HttpServer, getCurrencies: GetCurrencies) {
        httpServer.register('get', '/currencies', async () => {
            return await getCurrencies.execute();
        });
    }
}

export default CurrencyController;