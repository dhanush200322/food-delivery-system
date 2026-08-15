import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app: Application = express();

// Basic Security Middleware
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://food-delivery-system-blush.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body Parsing Middleware
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Register Routes
// Using /api as the base path for all future routes, except health which sits at root or /api
app.use('/api', routes);

// To preserve the existing /health and /health/db backwards compatibility 
// exactly as requested (without /api prefix):
app.use('/', routes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
