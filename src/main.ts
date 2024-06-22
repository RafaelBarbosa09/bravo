import { config } from 'dotenv';
import express from 'express';
import { getAllExchangeRates, getExchangeRate } from "./currencyService";
import { HttpStatusCode } from 'axios';
import PostgresAdapter from './PostgresAdapter';
import CurrencyRepositoryDatabase from './CurrencyRepositoryDatabase';
import GetCurrencies from './GetCurrencies';

config({ path: `./.env.${process.env.NODE_ENV}` });
const app = express();
const port = process.env.PORT;

app.use(express.json());

const databaseConnection = new PostgresAdapter();
const currencyRepository = new CurrencyRepositoryDatabase(databaseConnection);
const getCurrencies = new GetCurrencies(currencyRepository);

app.get('/currencies', async (req, res) => {
    console.log('GET /currencies');
    const currencies = await getCurrencies.execute();
    res.status(HttpStatusCode.Ok).json(currencies);
});

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.get('/convert', async (req, res) => {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
        return res.status(HttpStatusCode.UnprocessableEntity).json({ error: 'Missing parameters' });
    }

    const rate = await getExchangeRate(from as string, to as string, amount as string);
    if (!rate) {
        return res.status(HttpStatusCode.InternalServerError).json({ error: 'Error fetching exchange rate' });
    }

    return res.json(rate);
});

app.get('/rates', async (req, res) => {
    const { from } = req.query;

    if (!from) {
        return res.status(HttpStatusCode.UnprocessableEntity).json({ error: 'Missing parameters' });
    }

    const rates = await getAllExchangeRates(from as string);
    if (!rates) {
        return res.status(HttpStatusCode.InternalServerError).json({ error: 'Error fetching exchange rates' });
    }

    return res.json(rates);
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});