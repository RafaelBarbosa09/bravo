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
import CreateCurrency from './application/usecases/CreateCurrency';
import RedisAdapter from './infra/cache/RedisAdapter';

config({ path: `./.env.${process.env.NODE_ENV}` });
const port = Number(process.env.PORT);

const httpServer = new ExpressAdapter();
const databaseConnection = new PostgresAdapter();
const cache = new RedisAdapter();

const currencyRepository = new CurrencyRepositoryDatabase(databaseConnection);
const logger = new LoggerConsole();

const createCurrency = new CreateCurrency(cache, currencyRepository);
const convertExchange = new ConvertExchange(logger, currencyRepository);
const getCurrencies = new GetCurrencies(cache, currencyRepository);
const getExchangeRates = new GetExchangeRates(logger);

new MainController(httpServer);
new CurrencyController(httpServer, getCurrencies, createCurrency);
new ExchangeController(httpServer, convertExchange, getExchangeRates);

httpServer.listen(port);