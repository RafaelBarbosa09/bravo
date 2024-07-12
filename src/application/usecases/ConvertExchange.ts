import { HttpStatusCode } from "axios";
import Logger from "../logger/Logger";
import CurrencyRepository from "../repositories/CurrencyRepository";
import Currency from "../../domain/Currency";

class ConvertExchange {
    logger: Logger;
    currencyRepository: CurrencyRepository;

    constructor(logger: Logger, currencyRepository: CurrencyRepository) {
        this.logger = logger;
        this.currencyRepository = currencyRepository;
    }

    async execute(from: string, to: string, amount: string): Promise<Output> {
        try {
            Currency.validateConversionEntry(from, to, amount);

            const fromCurrency = await this.currencyRepository.getByCode(from);
            const toCurrency = await this.currencyRepository.getByCode(to);

            if(!fromCurrency || !toCurrency) {
                throw new Error('Currency not found');
            }

            const conversionRate = fromCurrency.conversionRate(toCurrency);
            const conversionResult = fromCurrency.convertTo(toCurrency, Number(amount));

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