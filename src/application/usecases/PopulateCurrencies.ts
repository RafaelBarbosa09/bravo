import Cache from "../../infra/cache/Cache";
import CurrencyRepository from "../repositories/CurrencyRepository";
import axios, {HttpStatusCode} from "axios";
import RequestError from "../errors/RequestError";
import Currency from "../../domain/Currency";
import {CurrencyType, Type} from "../../utils/@types/Currency";
import CurrencyFactory from "../../domain/factories/CurrencyFactory";

class PopulateCurrencies {
    cache: Cache;
    currencyRepository: CurrencyRepository;
    baseUrl: string;
    supportedCurrencies: string[];
    cryptoCurrencies: string[];

    constructor(cache: Cache, currencyRepository: CurrencyRepository) {
        this.cache = cache;
        this.currencyRepository = currencyRepository;
        this.baseUrl = process.env.EXCHANGE_RATE_API_URL || '';
        this.supportedCurrencies = ['USD', 'BRL', 'EUR', 'BTC', 'ETH'];
        this.cryptoCurrencies = ['BTC', 'ETH'];
    }

    async execute(): Promise<Output> {
        try {
            const cacheKey = "currencies";

            const { data: conversionRates } = await axios.get(this.baseUrl);
            if(!conversionRates) throw new RequestError('Error fetching exchange rates');

            const rates: Currency[] =  Object.keys(conversionRates)
                .filter(currency => this.supportedCurrencies.includes(currency))
                .map(currency => {
                    const type = this.cryptoCurrencies.includes(currency) ? Type.CRYPTO : Type.FIAT;
                    return CurrencyFactory.create(currency, type, conversionRates[currency]['USD']);
                });

            await this.currencyRepository.saveAll(rates);
            await this.cache.invalidate(cacheKey);

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

export default PopulateCurrencies;