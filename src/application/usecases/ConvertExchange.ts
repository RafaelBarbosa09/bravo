import axios, { HttpStatusCode } from "axios";
import Logger from "../logger/Logger";
import MissingParametersError from "../errors/MissingParametersError";
import CurrencyRepository from "../repositories/CurrencyRepository";
import currencyRepository from "../repositories/CurrencyRepository";

class ConvertExchange {
    logger: Logger;
    currencyRepository: CurrencyRepository;

    constructor(logger: Logger, currencyRepository: CurrencyRepository) {
        this.logger = logger;
        this.currencyRepository = currencyRepository;
    }

    async execute(from: string, to: string, amount: string): Promise<Output> {
        try {
            if (!from || !to || !amount) throw new MissingParametersError("Missing parameters 'from', 'to' or 'amount'");

            const fromCurrency = await this.currencyRepository.getByCode(from);
            const toCurrency = await this.currencyRepository.getByCode(to);

            const maxAmount = Math.max(fromCurrency!!.amount, toCurrency!!.amount);
            const minAmount = Math.min(fromCurrency!!.amount, toCurrency!!.amount);
            const conversionRate = maxAmount / minAmount;

            return {
                statusCode: HttpStatusCode.Ok,
                data: {
                    conversionRate: conversionRate,
                    conversionResult: conversionRate * Number(amount)
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