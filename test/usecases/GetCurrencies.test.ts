import { HttpStatusCode } from "axios";
import CurrencyRepositoryDatabase from "../../src/infra/repositories/CurrencyRepositoryDatabase";
import { CurrencyType } from "../../src/utils/@types/Currency";
import GetCurrencies from "../../src/application/usecases/GetCurrencies";
import RedisAdapter from "../../src/infra/cache/RedisAdapter";

jest.mock('../../src/infra/cache/RedisAdapter');
jest.mock('../../src/infra/repositories/CurrencyRepositoryDatabase');

describe('GetCurrencies', () => {
    beforeEach(() => {
        RedisAdapter.prototype.get = jest.fn().mockResolvedValue(null);
        CurrencyRepositoryDatabase.prototype.getAll = jest.fn().mockResolvedValue(currenciesMock);
    });
    const currenciesMock: CurrencyType[] = [
        {
            id: '6049275a-8a68-4035-bf68-057c1dc6939a',
            code: 'USD',
            type: 'fiat',
            amount: 1,
            createdAt: new Date('2021-03-13T00:00:00Z'),
            updatedAt: new Date('2021-03-13T00:00:00Z')
        }
    ];

    it('should be able to get currencies successfully', async () => {
        const cache = new RedisAdapter();
        const repository = new CurrencyRepositoryDatabase(null);
        const getCurrencies = new GetCurrencies(cache, repository);
        const response = await getCurrencies.execute();

        expect(response.statusCode).toBe(HttpStatusCode.Ok);
        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(repository.getAll).toHaveBeenCalledTimes(1);
        expect(cache.set).toHaveBeenCalledTimes(1);
        expect(cache.set).toHaveBeenCalledWith('currencies', currenciesMock);
    });

    it('should be able to get currencies from cache', async () => {
        RedisAdapter.prototype.get = jest.fn().mockResolvedValue(currenciesMock);

        const cache = new RedisAdapter();
        const repository = new CurrencyRepositoryDatabase(null);
        const getCurrencies = new GetCurrencies(cache, repository);
        const response = await getCurrencies.execute();

        expect(response.statusCode).toBe(HttpStatusCode.Ok);
        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(repository.getAll).toHaveBeenCalledTimes(0);
        expect(cache.set).toHaveBeenCalledTimes(0);
    });

    it('should return an error when fetching currencies', async () => {
        const errorMessage = 'Failed to fetch currencies';
        CurrencyRepositoryDatabase.prototype.getAll = jest.fn().mockRejectedValue(new Error(errorMessage));

        const cache = new RedisAdapter();
        const repository = new CurrencyRepositoryDatabase(null);
        const getCurrencies = new GetCurrencies(cache, repository);
        const result = await getCurrencies.execute();

        expect(result.statusCode).toBe(HttpStatusCode.InternalServerError);
        expect(result.data).toEqual({ error: `Error fetching currencies: Error: ${errorMessage}` });
        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(repository.getAll).toHaveBeenCalledTimes(1);
        expect(cache.set).toHaveBeenCalledTimes(0);
    });
});