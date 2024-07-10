export type CurrencyType = {
    id: string;
    code: string;
    type: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
};


export const Type  = {
    FIAT: 'fiat',
    CRYPTO: 'crypto',
    FICTITIOUS: 'fictitious'
}