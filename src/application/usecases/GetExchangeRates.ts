import axios, { HttpStatusCode } from "axios";
import Logger from "../logger/Logger";
import RequestError from "../errors/RequestError";
import Currency from "../../domain/Currency";
import {CurrencyType, Type} from "../../utils/@types/Currency";
import CurrencyFactory from "../../domain/factories/CurrencyFactory";


class GetExchangeRates {
    baseURL: string;
    logger: Logger;
    supportedCurrencies: string[];
    cryptoCurrencies: string[];

    constructor(logger: Logger) {
        if (!process.env.EXCHANGE_RATE_API_URL) throw new Error('Missing environment variable EXCHANGE_RATE_API_URL');
        this.logger = logger;
        this.baseURL = process.env.EXCHANGE_RATE_API_URL || '';
        this.supportedCurrencies = ['USD', 'BRL', 'EUR', 'BTC', 'ETH'];
        this.cryptoCurrencies = ['BTC', 'ETH'];
    }

    async execute(): Promise<Output> {
        try {
            const { data: conversionRates } = await axios.get(this.baseURL);
            if(!conversionRates) throw new RequestError('Error fetching exchange rates');

            const rates: Currency[] =  Object.keys(conversionRates)
                .filter(currency => this.supportedCurrencies.includes(currency))
                .map(currency => {
                    const type = this.cryptoCurrencies.includes(currency) ? Type.CRYPTO : Type.FIAT;
                    return CurrencyFactory.create(currency, type, conversionRates[currency]['USD']);
                });

            return {
                statusCode: HttpStatusCode.Ok,
                data: rates
            };
        } catch (error) {
            return {
                statusCode: HttpStatusCode.InternalServerError,
                data: {
                    error: `Error fetching exchange rates: ${error}`
                }
            };
        }
    }
}

type OutputError = {
    error: string

}

type Output = {
    statusCode: number
    data: CurrencyType[] | OutputError
}

export default GetExchangeRates;