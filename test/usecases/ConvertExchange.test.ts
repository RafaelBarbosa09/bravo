import RedisAdapter from "../../src/infra/cache/RedisAdapter";
import CurrencyRepositoryDatabase from "../../src/infra/repositories/CurrencyRepositoryDatabase";
import LoggerConsole from "../../src/infra/logger/LoggerConsole";
import ConvertExchange from "../../src/application/usecases/ConvertExchange";
import { HttpStatusCode } from "axios";

jest.mock('../../src/infra/logger/LoggerConsole');
jest.mock('../../src/infra/cache/RedisAdapter');
jest.mock('../../src/infra/repositories/CurrencyRepositoryDatabase');

const fromCurrency = {
    id: '6049275a-8a68-4035-bf68-057c1dc6939a',
    code: 'USD',
    type: 'fiat',
    amount: 1,
    createdAt: new Date('2021-03-13T00:00:00Z'),
    updatedAt: new Date('2021-03-13T00:00:00Z'),
    conversionRate: jest.fn().mockReturnValue(5),
    convertTo: jest.fn().mockReturnValue(11)
};
const toCurrency = {
    id: '4b287b4a-27b4-47b9-acac-4fa26f632b46',
    code: 'BRL',
    type: 'fiat',
    amount: 1,
    createdAt: new Date('2021-03-13T00:00:00Z'),
    updatedAt: new Date('2021-03-13T00:00:00Z')
};

describe('ConvertExchange', () => {
    let logger: LoggerConsole;
    let cache: RedisAdapter;
    let repository: CurrencyRepositoryDatabase;

    beforeEach(() => {
        LoggerConsole.prototype.error = jest.fn();
        RedisAdapter.prototype.get = jest.fn().mockResolvedValue(null);
        RedisAdapter.prototype.set = jest.fn();

        logger = new LoggerConsole();
        cache = new RedisAdapter();
        repository = new CurrencyRepositoryDatabase(null);
    });

    it('should be able to convert exchange successfully', async () => {
        CurrencyRepositoryDatabase.prototype.getByCode = jest.fn()
            .mockResolvedValueOnce(fromCurrency)
            .mockResolvedValueOnce(toCurrency);

        repository = new CurrencyRepositoryDatabase(null);
        const convertExchange = new ConvertExchange(logger, cache, repository);
        const response = await convertExchange.execute('USD', 'BRL', 1);

        expect(response.statusCode).toBe(HttpStatusCode.Ok);
        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(repository.getByCode).toHaveBeenCalledTimes(2);
        expect(cache.set).toHaveBeenCalledTimes(1);
    });

    it('should return an error when converting exchange', async () => {
        const errorMessage = 'Failed to convert exchange';
        CurrencyRepositoryDatabase.prototype.getByCode = jest.fn().mockRejectedValue(new Error(errorMessage));

        repository = new CurrencyRepositoryDatabase(null);
        const convertExchange = new ConvertExchange(logger, cache, repository);
        const response = await convertExchange.execute('USD', 'BRL', 1);

        expect(response.statusCode).toBe(HttpStatusCode.InternalServerError);
        expect(response.data).toEqual({ error: `Error fetching exchange rate: Error: ${errorMessage}` });
        expect(logger.error).toHaveBeenCalledTimes(1);
        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(repository.getByCode).toHaveBeenCalledTimes(1);
        expect(cache.set).toHaveBeenCalledTimes(0);
    });

    it('should return an error when from currency is not passed', async () => {
        const errorMessage = "Missing parameters 'from', 'to' or 'amount'";
        const convertExchange = new ConvertExchange(logger, cache, repository);
        const response = await convertExchange.execute('', 'BRL', 1);

        expect(response.data).toStrictEqual({ error: `Error fetching exchange rate: MissingParametersError: ${errorMessage}` });
    });

    it('should return an error when to currency is not passed', async () => {
        const errorMessage = "Missing parameters 'from', 'to' or 'amount'";
        const convertExchange = new ConvertExchange(logger, cache, repository);
        const response = await convertExchange.execute('USD', '', 1);

        expect(response.data).toStrictEqual({ error: `Error fetching exchange rate: MissingParametersError: ${errorMessage}` });
    });

    it('should return an error when amount is not passed', async () => {
        const errorMessage = "Missing parameters 'from', 'to' or 'amount'";
        const convertExchange = new ConvertExchange(logger, cache, repository);
        const response = await convertExchange.execute('USD', 'BRL', 0);

        expect(response.data).toStrictEqual({ error: `Error fetching exchange rate: MissingParametersError: ${errorMessage}` });
    });

    it('should be able to convert exchange from cache', async () => {
        RedisAdapter.prototype.get = jest.fn().mockResolvedValue(5);

        cache = new RedisAdapter();
        const convertExchange = new ConvertExchange(logger, cache, repository);
        const response = await convertExchange.execute('USD', 'BRL', 1);

        expect(response.statusCode).toBe(HttpStatusCode.Ok);
        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(repository.getByCode).toHaveBeenCalledTimes(0);
        expect(cache.set).toHaveBeenCalledTimes(0);
    });
});