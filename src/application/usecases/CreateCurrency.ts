import { HttpStatusCode } from "axios";
import {CurrencyType, Type} from "../../utils/@types/Currency";
import CurrencyRepository from "../repositories/CurrencyRepository";
import Cache from "../../infra/cache/Cache";
import FictitiousCurrency from "../../domain/FictitiousCurrency";

class CreateCurrency {
    cache: Cache;
    currencyRepository: CurrencyRepository;

    constructor(cache: Cache, currencyRepository: CurrencyRepository) {
        this.cache = cache;
        this.currencyRepository = currencyRepository;
    }

    async execute(input: Input): Promise<Output> {
        try {
            const { code, amount } = input;
            const currency = FictitiousCurrency.create(code, amount);

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