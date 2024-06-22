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

    static create(code: string, type: string, amount: number) {
        const id = crypto.randomUUID();
        const createdAt = new Date();
        const updatedAt = new Date();
        return new Currency(id, code, type, amount, createdAt, updatedAt);
    }

    static restore(id: string, code: string, type: string, amount: number, createdAt: Date, updatedAt: Date) {
        return new Currency(id, code, type, amount, createdAt, updatedAt);
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
};

export default Currency;