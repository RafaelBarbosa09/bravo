import { HttpStatusCode } from "axios";
import Cache from "../../infra/cache/Cache";
import Logger from "../logger/Logger";
import CurrencyRepository from "../repositories/CurrencyRepository";
import Currency from "../../domain/Currency";

class ConvertExchange {
    logger: Logger;
    cache: Cache;
    currencyRepository: CurrencyRepository;

    constructor(logger: Logger, cache: Cache, currencyRepository: CurrencyRepository) {
        this.logger = logger;
        this.cache = cache;
        this.currencyRepository = currencyRepository;
    }

    async execute(from: string, to: string, amount: number): Promise<Output> {
        try {
            Currency.validateConversionEntry(from, to, amount);

            const cacheKey = `exchange:${from}:${to}`;
            let conversionRate = await this.cache.get<number>(cacheKey);
            let conversionResult: number;

            if (conversionRate) {
                conversionResult = Number(amount) * conversionRate;
                return {
                    statusCode: HttpStatusCode.Ok,
                    data: {
                        conversionRate: parseFloat(conversionRate.toFixed(2)),
                        conversionResult: parseFloat(conversionResult.toFixed(2))
                    }
                };
            }

            const fromCurrency = await this.currencyRepository.getByCode(from);
            const toCurrency = await this.currencyRepository.getByCode(to);

            if(!fromCurrency || !toCurrency) {
                throw new Error('Currency not found');
            }

            conversionRate = fromCurrency.conversionRate(toCurrency);
            conversionResult = fromCurrency.convertTo(toCurrency, Number(amount));

            await this.cache.set(cacheKey, conversionRate);

            return {
                statusCode: HttpStatusCode.Ok,
                data: {
                    conversionRate: parseFloat(conversionRate.toFixed(2)),
                    conversionResult: parseFloat(conversionResult.toFixed(2))
                }
            };
        } catch (error) {
            this.logger.error(`Error fetching exchange rate: ${error}`);
            return {
                statusCode: HttpStatusCode.InternalServerError,
                data: {
                    error: `Error fetching exchange rate: ${error}`
                }
            };
        }
    }
}

type Success = {
    conversionRate: number;
    conversionResult: number;
}

type Error = {
    error: string;
}

type Output = {
    statusCode: number;
    data: Success | Error;
}

export default ConvertExchange;