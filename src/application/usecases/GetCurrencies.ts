import { HttpStatusCode } from "axios";
import CurrencyRepository from "../repositories/CurrencyRepository";

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

type Currency = {
    id: string;
    code: string;
    type: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
};

type Output = {
    statusCode: number;
    data: Currency[];
}

export default GetCurrencies;