import FiatCurrency from "../FiatCurrency";
import CryptoCurrency from "../CryptoCurrency";
import FictitiousCurrency from "../FictitiousCurrency";

class CurrencyFactory {
    private static currencyMap = new Map<string, any>([
        ['fiat', FiatCurrency],
        ['crypto', CryptoCurrency],
        ['fictitious', FictitiousCurrency]
    ]);

    static create(code: string, type: string, amount: number) {
        const currency = CurrencyFactory.currencyMap.get(type);

        if (!currency) {
            throw new Error('Invalid currency type');
        }

        return currency.create(code, amount);
    }
}

export default CurrencyFactory;