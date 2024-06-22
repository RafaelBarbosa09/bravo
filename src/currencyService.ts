import axios from "axios";

const baseURL = `${process.env.EXCHANGE_RATE_API_URL}/${process.env.EXCHANGE_RATE_API_KEY}`;

export const getExchangeRate = async (from: string, to: string, amount: string): Promise<any> => {
    try {
        const { data } = await axios.get(`${baseURL}/pair/${from}/${to}/${amount}`);
        return data;
    } catch (error) {
        console.error('Error fetching exchange rate', error);
        return null;
    }
};

export const getAllExchangeRates = async (from: string): Promise<any> => {
    try {
        const { data } = await axios.get(`${baseURL}/latest/${from}`);
        return data;
    } catch (error) {
        console.error('Error fetching exchange rates', error);
        return null;
    }
};