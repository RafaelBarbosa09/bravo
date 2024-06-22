import axios from "axios";
import MissingParametersError from "./MissingParametersError";

class ConvertExchange {
    baseURL: string;

    constructor() {
        this.baseURL = `${process.env.EXCHANGE_RATE_API_URL}/${process.env.EXCHANGE_RATE_API_KEY}`;
    }

    async execute(from: string, to: string, amount: string): Promise<any> {
        try {
            if (!from || !to || !amount) throw new MissingParametersError("Missing parameters 'from', 'to' or 'amount'");
            const { data } = await axios.get(`${this.baseURL}/pair/${from}/${to}/${amount}`);
            return data;
        } catch (error) {
            console.error('Error fetching exchange rate: ', error);
            return null;
        }
    }
}

export default ConvertExchange;