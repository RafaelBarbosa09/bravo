import axios, { HttpStatusCode } from "axios";
import Logger from "../logger/Logger";
import MissingParametersError from "../errors/MissingParametersError";


class GetExchangeRates {
    baseURL: string;
    logger: Logger;

    constructor(logger: Logger) {
        if (!process.env.EXCHANGE_RATE_API_URL) throw new Error('Missing environment variable EXCHANGE_RATE_API_URL');
        if (!process.env.EXCHANGE_RATE_API_KEY) throw new Error('Missing environment variable EXCHANGE_RATE_API_KEY');
        this.baseURL = `${process.env.EXCHANGE_RATE_API_URL}/${process.env.EXCHANGE_RATE_API_KEY}`;
        this.logger = logger;
    }

    async execute2(from: string): Promise<any> {
        try {
            if (!from) {
                throw new MissingParametersError("Missing parameter 'from'");
            }
            const { data } = await axios.get(`${this.baseURL}/latest/${from}`);
            return {
                statusCode: HttpStatusCode.Ok,
                data
            };
        } catch (error) {
            this.logger.error(`Error fetching exchange rates: ${error}`);
            return null;
        }
    }
}

export default GetExchangeRates;