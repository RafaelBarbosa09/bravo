
import crypto from "crypto";
import {Type} from "../utils/@types/Currency";
import Currency from "./Currency";

class FiatCurrency extends Currency {
    constructor(readonly id: string, code: string, type: string, amount: number, readonly createdAt: Date, readonly updatedAt: Date) {
        super(id, code, type, amount, createdAt, updatedAt);
    }

    static create(code: string, amount: number) {
        const id = crypto.randomUUID();
        const createdAt = new Date();
        const updatedAt = new Date();

        return new FiatCurrency(id, code, Type.FIAT, amount, createdAt, updatedAt);
    }

    static restore(id: string, code: string, type: string, amount: number, createdAt: Date, updatedAt: Date) {
        return new FiatCurrency(id, code, type, amount, createdAt, updatedAt);
    }
}

export default FiatCurrency;