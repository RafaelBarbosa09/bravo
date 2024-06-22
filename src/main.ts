import { config } from 'dotenv';
import express from 'express';
import { HttpStatusCode } from 'axios';
import PostgresAdapter from './PostgresAdapter';
import CurrencyRepositoryDatabase from './CurrencyRepositoryDatabase';
import GetCurrencies from './GetCurrencies';
import GetExchangeRates from './GetExchangeRates';
import ConvertExchange from './ConvertExchange';
import LoggerConsole from './LoggerConsole';

config({ path: `./.env.${process.env.NODE_ENV}` });
const app = express();
const port = process.env.PORT;

app.use(express.json());

const databaseConnection = new PostgresAdapter();
const currencyRepository = new CurrencyRepositoryDatabase(databaseConnection);
const logger = new LoggerConsole();
const getCurrencies = new GetCurrencies(currencyRepository);
const getExchangeRates = new GetExchangeRates(logger);
const convertExchange = new ConvertExchange(logger);

app.get('/healthcheck', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/readiness', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/currencies', async (req, res) => {
    const currencies = await getCurrencies.execute();
    res.status(HttpStatusCode.Ok).json(currencies);
});

app.get('/convert', async (req, res) => {
    const { from, to, amount } = req.query;
    const rate = await convertExchange.execute(from as string, to as string, amount as string);
    if (!rate) return res.status(HttpStatusCode.InternalServerError).json({ error: 'Error fetching exchange rate' });
    return res.json(rate);
});

app.get('/rates', async (req, res) => {
    const { from } = req.query;
    const rates = await getExchangeRates.execute(from as string);
    if (!rates) return res.status(HttpStatusCode.InternalServerError).json({ error: 'Error fetching exchange rates' });
    return res.json(rates);
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});