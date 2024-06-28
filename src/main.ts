import { config } from 'dotenv';
import ConvertExchange from './application/usecases/ConvertExchange';
import GetCurrencies from './application/usecases/GetCurrencies';
import GetExchangeRates from './application/usecases/GetExchangeRates';
import Cronjob from './infra/cron/Cronjob';
import CurrencyController from './infra/controllers/CurrencyController';
import CurrencyRepositoryDatabase from './infra/repositories/CurrencyRepositoryDatabase';
import ExchangeController from './infra/controllers/ExchangeController';
import ExpressAdapter from './infra/http/ExpressAdapter';
import LoggerConsole from './infra/logger/LoggerConsole';
import MainController from './infra/controllers/MainController';
import PostgresAdapter from './infra/database/PostgresAdapter';

config({ path: `./.env.${process.env.NODE_ENV}` });
const port = Number(process.env.PORT);

const httpServer = new ExpressAdapter();
const databaseConnection = new PostgresAdapter();

const currencyRepository = new CurrencyRepositoryDatabase(databaseConnection);
const logger = new LoggerConsole();

const getCurrencies = new GetCurrencies(currencyRepository);
const getExchangeRates = new GetExchangeRates(logger);
const convertExchange = new ConvertExchange(logger);

new MainController(httpServer);
new CurrencyController(httpServer, getCurrencies);
new ExchangeController(httpServer, convertExchange, getExchangeRates);

const cronjob = new Cronjob(logger);
cronjob.start();

httpServer.listen(port);