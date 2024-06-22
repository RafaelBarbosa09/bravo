import ConvertExchange from "../../application/usecases/ConvertExchange";
import HttpServer from "../http/HttpServer";
import GetExchangeRates from "../../application/usecases/GetExchangeRates";

class ExchangeController {
    constructor(readonly httpServer: HttpServer, convertExchange: ConvertExchange, getExchangeRates: GetExchangeRates) {
        httpServer.register('get', '/convert', async (body: any, query: any, params: any) => {
            const { from, to, amount } = query;
            return await convertExchange.execute(from as string, to as string, amount as string);
        });

        httpServer.register('get', '/rates', async (body: any, query: any, params: any) => {
            const { from } = query;
            return await getExchangeRates.execute(from as string);
        });
    }
}

export default ExchangeController;