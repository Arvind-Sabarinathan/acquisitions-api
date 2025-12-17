import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from '#config/logger.js';
import authRouter from '#routes/auth.routes.js';
import securityMiddleware from '#middlewares/security.middleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  morgan('combined', {
    stream: {
      write: message => logger.info(message.trim()),
    },
  })
);

app.use(securityMiddleware);

app.get('/', (req, res) => {
  logger.info('Welcome to Acquisitions API!');
  res.status(200).json({ message: 'Welcome to Acquisitions API!' });
});

app.get('/health', (req, res) => {
  logger.info('Health check');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  logger.info('API route');
  res.status(200).json({ message: 'Acquisitions API is up and running!' });
});

app.use('/api/auth', authRouter);

export default app;
