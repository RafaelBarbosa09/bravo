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

    async update(currency: Currency): Promise<void> {
        await this.connection.query('UPDATE currency SET amount = $1, updated_at = $2 WHERE id = $3',
            [currency.amount, currency.updatedAt, currency.id]
        );
    }

    async deleteAll(): Promise<void> {
        await this.connection.query('DELETE FROM currency');
    }

    async saveAll(currencies: Currency[]): Promise<void> {
        await this.deleteAll();
        for (const currency of currencies) {
            await this.create(currency);
        }
    }
}

export default CurrencyRepositoryDatabase;