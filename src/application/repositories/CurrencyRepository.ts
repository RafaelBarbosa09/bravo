import Currency from "../../domain/Currency";

interface CurrencyRepository {
    getAll(): Promise<Currency[]>;
    create(currency: Currency): Promise<void>;
    getByCode(code: string): Promise<Currency | null>;
}

export default CurrencyRepository;