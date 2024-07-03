class CurrencyNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CurrencyNotFoundError';
  }
}

export default CurrencyNotFoundError;