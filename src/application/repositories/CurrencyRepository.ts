import Currency from "../../domain/Currency";

interface CurrencyRepository {
    getAll(): Promise<Currency[]>;
};

export default CurrencyRepository;