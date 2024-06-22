interface CurrencyRepository {
    getAll(): Promise<Currency[]>;
};

export default CurrencyRepository;