import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimiter from './middleware/rateLimiter.js';
import logger from './middleware/logger.js';
import { whoAmIHandler } from './controllers/whoamiController.js';
import { messengerHandler } from './controllers/messengerController.js';
import { queryHandler } from './controllers/queryController.js';
import { healthHandler } from './controllers/healthController.js';
import { PORT } from './config/config.js';

const app = express();

// Middleware setup
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Routes setup
app.get('/whoami', logger, whoAmIHandler);
app.post('/messenger', logger, messengerHandler);
app.post('/query', queryHandler);
app.get('/health', logger, healthHandler);

// 404 Handler
app.all('*', logger, (req, res) => res.status(404).send('Requested resource not found on server.'));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
