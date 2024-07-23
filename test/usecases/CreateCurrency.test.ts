import { HttpStatusCode } from "axios";
import CreateCurrency from "../../src/application/usecases/CreateCurrency";
import CurrencyRepositoryDatabase from "../../src/infra/repositories/CurrencyRepositoryDatabase";
import RedisAdapter from "../../src/infra/cache/RedisAdapter";
import { CurrencyType, Type } from "../../src/utils/@types/Currency";

jest.mock('../../src/infra/cache/RedisAdapter');
jest.mock('../../src/infra/repositories/CurrencyRepositoryDatabase');

describe('CreateCurrency', () => {
    beforeEach(() => {
        RedisAdapter.prototype.invalidate = jest.fn();
        CurrencyRepositoryDatabase.prototype.create = jest.fn();
    });

    it('should be able to create a currency successfully', async () => {
        const cache = new RedisAdapter();
        const repository = new CurrencyRepositoryDatabase(null);
        const createCurrency = new CreateCurrency(cache, repository);
        const response = await createCurrency.execute({ code: 'USD', amount: 1 });
        const currency = response.data as CurrencyType;


        expect(response.statusCode).toBe(HttpStatusCode.Created);
        expect(currency.id).toBeDefined();
        expect(currency.type).toBe(Type.FICTITIOUS);
        expect(repository.create).toHaveBeenCalledTimes(1);
        expect(cache.invalidate).toHaveBeenCalledTimes(1);
    });

    it('should return an error when creating a currency', async () => {
        const errorMessage = 'Failed to create currency';
        CurrencyRepositoryDatabase.prototype.create = jest.fn().mockRejectedValue(new Error(errorMessage));

        const cache = new RedisAdapter();
        const repository = new CurrencyRepositoryDatabase(null);
        const createCurrency = new CreateCurrency(cache, repository);
        const result = await createCurrency.execute({ code: 'USD', amount: 1 });

        expect(result.statusCode).toBe(HttpStatusCode.InternalServerError);
        expect(result.data).toEqual({ error: `Error creating currency: Error: ${errorMessage}` });
    });
});