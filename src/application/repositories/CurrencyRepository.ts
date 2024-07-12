import Currency from "../../domain/Currency";

interface CurrencyRepository {
    getAll(): Promise<Currency[]>;
    create(currency: Currency): Promise<void>;
    getByCode(code: string): Promise<Currency | null>;
    update(currency: Currency): Promise<void>;
    saveAll(currencies: Currency[]): Promise<void>;
}

export default CurrencyRepository;