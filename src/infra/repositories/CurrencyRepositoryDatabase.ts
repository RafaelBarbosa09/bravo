import Currency from "../../domain/Currency";
import CurrencyRepository from "../../application/repositories/CurrencyRepository";


class CurrencyRepositoryDatabase implements CurrencyRepository {
    constructor(readonly connection: any) { }

    async getAll(): Promise<Currency[]> {
        const currencies = await this.connection.query('SELECT * FROM currency');
        const test = currencies.map((currency: any) => {
            return Currency.restore(currency.id, currency.code, currency.type, currency.amount, currency.created_at, currency.updated_at);
        });

        return test;
    };
};

export default CurrencyRepositoryDatabase;