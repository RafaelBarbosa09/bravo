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

    async create(currency: Currency): Promise<void> {
        await this.connection.query('INSERT INTO currency (id, code, type, amount) VALUES ($1, $2, $3, $4)',
            [currency.id, currency.code, currency.type, currency.amount]
        );
    };

    async getByCode(code: string): Promise<Currency | null> {
        const [currency] = await this.connection.query('SELECT * FROM currency WHERE code = $1', [code]);
        if (!currency) {
            return null;
        }

        return Currency.restore(currency.id, currency.code, currency.type, currency.amount, currency.created_at, currency.updated_at);
    };
}

export default CurrencyRepositoryDatabase;