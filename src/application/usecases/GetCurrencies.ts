import axios, {HttpStatusCode} from "axios";
import CurrencyRepository from "../repositories/CurrencyRepository";
import {CurrencyType, Type} from "../../utils/@types/Currency";
import Cache from "../../infra/cache/Cache";
import Currency from "../../domain/Currency";
import RequestError from "../errors/RequestError";

class GetCurrencies {
    cache: Cache;
    currencyRepository: CurrencyRepository;
    baseUrl: string;
    supportedCurrencies: string[];
    backingCurrency: string;

    constructor(cache: Cache, currencyRepository: CurrencyRepository) {
        this.cache = cache;
        this.currencyRepository = currencyRepository;
        this.baseUrl = `${process.env.EXCHANGE_RATE_API_URL}/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`;
        this.supportedCurrencies = ['USD', 'BRL', 'EUR', 'BTC', 'ETH'];
        this.backingCurrency = 'USD';
    }

    async rates(): Promise<any> {
        try {
            const cacheKey = "currencies";
            const { data: conversionRates } = await axios.get('https://api.coingate.com/api/v2/rates/merchant');

            if(!conversionRates) throw new RequestError('Error fetching exchange rates');

            const rates: Currency[] =  Object.keys(conversionRates)
                .filter(currency => this.supportedCurrencies.includes(currency))
                .map(currency => {
                    return Currency.create(currency, Type.FIAT, conversionRates[currency]['USD']);
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

    async execute(): Promise<Output> {
        try {
            const cacheKey = "currencies";
            const cachedCurrencies = await this.cache.get<CurrencyType[]>(cacheKey);
            if (cachedCurrencies) {
                return {
                    statusCode: HttpStatusCode.Ok,
                    data: cachedCurrencies
                }
            }

            const currencies = await this.currencyRepository.getAll();
            await this.cache.set(cacheKey, currencies);

            return {
                statusCode: HttpStatusCode.Ok,
                data: currencies
            };
        } catch (error) {
            return {
                statusCode: HttpStatusCode.InternalServerError,
                data: {
                    error: `Error fetching currencies: ${error}`
                }
            };
        }
    }
}

type OutputError = {
    error: string;
};

type Output = {
    statusCode: number;
    data: CurrencyType[] | OutputError;
};

export default GetCurrencies;