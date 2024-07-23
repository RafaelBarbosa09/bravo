import { HttpStatusCode } from "axios";
import CurrencyRepository from "../repositories/CurrencyRepository";
import { CurrencyType } from "../../utils/@types/Currency";
import Cache from "../../infra/cache/Cache";

class GetCurrencies {
    private cache: Cache;
    private currencyRepository: CurrencyRepository;

    constructor(cache: Cache, currencyRepository: CurrencyRepository) {
        this.cache = cache;
        this.currencyRepository = currencyRepository;
    }

    async execute(): Promise<Output> {
        try {
            const cacheKey = "currencies";
            const cachedCurrencies = await this.cache.get<CurrencyType[]>(cacheKey);
            if (cachedCurrencies) {
                return {
                    statusCode: HttpStatusCode.Ok,
                    data: cachedCurrencies
                }
            }

            const currencies = await this.currencyRepository.getAll();
            await this.cache.set(cacheKey, currencies);

            return {
                statusCode: HttpStatusCode.Ok,
                data: currencies
            };
        } catch (error) {
            return {
                statusCode: HttpStatusCode.InternalServerError,
                data: {
                    error: `Error fetching currencies: ${error}`
                }
            };
        }
    }
}

type OutputError = {
    error: string;
};

type Output = {
    statusCode: number;
    data: CurrencyType[] | OutputError;
};

export default GetCurrencies;