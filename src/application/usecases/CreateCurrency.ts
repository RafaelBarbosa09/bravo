import { HttpStatusCode } from "axios";
import Currency from "../../domain/Currency";
import { CurrencyType } from "../../utils/@types/Currency";
import CurrencyRepository from "../repositories/CurrencyRepository";
import Cache from "../../infra/cache/Cache";

class CreateCurrency {
    constructor(private cache: Cache, private currencyRepository: CurrencyRepository) { }

    async execute(input: Input): Promise<Output> {
        try {
            const { code, type, amount } = input;
            const currency = Currency.create(code, type, amount);

            await this.currencyRepository.create(currency);

            await this.cache.invalidate('currencies');

            return {
                statusCode: HttpStatusCode.Created,
                data: currency
            };
        } catch (error) {
            return {
                statusCode: HttpStatusCode.InternalServerError,
                data: {
                    error: `Error creating currency: ${error}`
                }
            };
        }

    }
}

type Input = {
    code: string;
    type: string;
    amount: number;
};

type OutputError = {
    error: string;
};

type Output = {
    statusCode: number;
    data: CurrencyType | OutputError;
}


export default CreateCurrency;