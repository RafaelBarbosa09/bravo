import MissingParametersError from "../application/errors/MissingParametersError";

class Currency {
    code: string;
    type: string;
    amount: number;

    constructor(readonly id: string, code: string, type: string, amount: number, readonly createdAt: Date, readonly updatedAt: Date) {
        if (this.validateCode(code)) throw new Error(`Invalid currency code.`);
        if (this.validateType(type)) throw new Error(`Invalid currency type.`);
        if (this.validateAmount(amount)) throw new Error(`Amount must be a positive number.`);

        this.id = id;
        this.code = code;
        this.type = type;
        this.amount = amount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static restore(id: string, code: string, type: string, amount: number, createdAt: Date, updatedAt: Date) {
        return new Currency(id, code, type, amount, createdAt, updatedAt);
    }

    static validateConversionEntry(from: string, to: string, amount: string) {
        if (!from || !to || !amount) throw new MissingParametersError("Missing parameters 'from', 'to' or 'amount'");
    }

    validateCode(code: string) {
        return !code;
    }

    validateType(type: string) {
        const validTypes = ['fiat', 'crypto', 'fictitious'];
        return !type || !validTypes.includes(type);
    }

    validateAmount(amount: number) {
        return amount <= 0;
    }

    conversionRate(toCurrency: Currency): number {
        return this.amount / toCurrency.amount;
    }

    convertTo(toCurrency: Currency, amount: number): number {
        return amount * (this.amount / toCurrency.amount);
    }
}

export default Currency;