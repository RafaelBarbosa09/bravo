import CurrencyRepository from "../repositories/CurrencyRepository";
import {CurrencyType} from "../../utils/@types/Currency";
import Currency from "../../domain/Currency";

class UpdateExchangeRates {
    constructor(private repository: CurrencyRepository) {}

    async execute(currencies: Input): Promise<void> {

        try {
            const currenciesFromRepository = await this.repository.getAll();

            for (const currency of currencies) {
                const currencyFound = currenciesFromRepository.find(c => c.code === currency.code);
                if (!currencyFound) continue;

                const currencyToUpdate = Currency.update(currencyFound.id, currencyFound.code, currencyFound.type, currencyFound.amount, currencyFound.createdAt)
                await this.repository.update(currencyToUpdate);
            }
        } catch (error) {
            throw new Error(`Error updating currencies: ${error}`)
        }
    }
}

type Input = CurrencyType[];

export default UpdateExchangeRates;