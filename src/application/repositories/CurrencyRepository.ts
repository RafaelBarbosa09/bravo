import Currency from "../../domain/Currency";

interface CurrencyRepository {
    getAll(): Promise<Currency[]>;
    create(currency: Currency): Promise<void>;
};

export default CurrencyRepository;