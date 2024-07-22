import Cache from "../../infra/cache/Cache";
import CurrencyRepository from "../repositories/CurrencyRepository";
import { CurrencyType } from "../../utils/@types/Currency";
import Currency from "../../domain/Currency";
import Logger from "../logger/Logger";

class UpdateExchangeRates {
    private cache: Cache;
    private logger: Logger;
    private repository: CurrencyRepository;

    constructor(cache: Cache, logger: Logger, repository: CurrencyRepository) {
        this.cache = cache;
        this.logger = logger;
        this.repository = repository;
    }

    async execute(currencies: Input): Promise<void> {
        try {
            const cacheKey = "exchange-rates";
            let foundCurrencies = await this.cache.get<CurrencyType[]>(cacheKey);

            if (!foundCurrencies) {
                foundCurrencies = await this.repository.getAll();
            }

            for (const currency of currencies) {
                const currencyFound = foundCurrencies.find(c => c.code === currency.code);
                if (!currencyFound) continue;

                const currencyToUpdate = Currency.update(
                    currencyFound.id,
                    currencyFound.code,
                    currencyFound.type,
                    currencyFound.amount,
                    currencyFound.createdAt
                );

                await this.repository.update(currencyToUpdate);

                await this.cache.invalidate(cacheKey);
            }

            this.logger.info('Currencies updated successfully');
        } catch (error) {
            this.logger.error(`Error updating currencies: ${error}`);
        }
    }
}

type Input = CurrencyType[];

export default UpdateExchangeRates;