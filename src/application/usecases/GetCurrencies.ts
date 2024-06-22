import CurrencyRepository from "../repositories/CurrencyRepository";

class GetCurrencies {
    constructor(private exchangeRateRepository: CurrencyRepository) { }

    async execute(): Promise<Output[]> {
        return this.exchangeRateRepository.getAll();
    }
};

type Output = {
    id: string;
    code: string;
    type: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
};

export default GetCurrencies;