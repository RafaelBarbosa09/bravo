import ConvertExchange from "../../application/usecases/ConvertExchange";
import HttpServer from "../http/HttpServer";
import GetExchangeRates from "../../application/usecases/GetExchangeRates";

class ExchangeController {
    constructor(readonly httpServer: HttpServer, convertExchange: ConvertExchange, getExchangeRates: GetExchangeRates) {
        httpServer.register('post', '/convert', async (body: any, query: any, params: any) => {
            const { from, to, amount } = body;
            return await convertExchange.execute(from as string, to as string, amount as string);
        });
    }
}

export default ExchangeController;