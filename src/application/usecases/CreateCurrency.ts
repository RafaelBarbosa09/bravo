import { HttpStatusCode } from "axios";
import Currency from "../../domain/Currency";
import { CurrencyType } from "../../utils/@types/Currency";
import CurrencyRepository from "../repositories/CurrencyRepository";

class CreateCurrency {
    constructor(private currencyRepository: CurrencyRepository) { }

    async execute(input: Input): Promise<Output> {
        const { code, type, amount } = input;
        const currency = Currency.create(code, type, amount);

        await this.currencyRepository.create(currency);

        return {
            statusCode: HttpStatusCode.Created,
            data: currency
        };
    }
}

type Input = {
    code: string;
    type: string;
    amount: number;
};

type Output = {
    statusCode: number;
    data: CurrencyType;
}


export default CreateCurrency;