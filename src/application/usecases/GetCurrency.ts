import CurrencyRepository from "../repositories/CurrencyRepository";
import CurrencyNotFoundError from "../errors/CurrencyNotFoundError";
import {CurrencyType} from "../../utils/@types/Currency";

class GetCurrency {
    constructor(private currencyRepository: CurrencyRepository){}

    async execute(code: string): Promise<Output> {
        const currency = await this.currencyRepository.getByCode(code);
        if (!currency) {
            throw new CurrencyNotFoundError('Currency not found');
        }

        return {
            statusCode: 200,
            data: currency
        }
    }
}

type Output = {
    statusCode: number;
    data: CurrencyType;
}

export default GetCurrency;