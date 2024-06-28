import { HttpStatusCode } from "axios";
import CurrencyRepository from "../repositories/CurrencyRepository";
import { CurrencyType } from "../../utils/@types/Currency";

class GetCurrencies {
    constructor(private exchangeRateRepository: CurrencyRepository) { }

    async execute(): Promise<Output> {
        const currencies = await this.exchangeRateRepository.getAll();
        return {
            statusCode: HttpStatusCode.Ok,
            data: currencies
        }
    }
};

type Output = {
    statusCode: number;
    data: CurrencyType[];
}

export default GetCurrencies;