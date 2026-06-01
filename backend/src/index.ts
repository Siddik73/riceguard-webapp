import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import apiRouter from './routes/api';
import { config, initSentry, captureError } from './config';
import { DiseaseLibraryService } from './services/disease-library.service';
import { AdminService } from './services/admin.service';

const app = express();

// Initialize Sentry Tracking
initSentry();

// Enable CORS
app.use(cors());

// Parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist and serve uploads folder statically
const uploadsPath = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
    mlServiceType: config.mlServiceType
  });
});

// API Routes
app.use('/api', apiRouter);

// Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  captureError(err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Bootstrap Server
const port = config.port;

const bootstrap = async () => {
  try {
    // Seed disease library and model registry on boot if empty
    const libraryService = new DiseaseLibraryService();
    await libraryService.seedLibraryIfEmpty();

    const adminService = new AdminService();
    await adminService.seedModelsIfEmpty();
  } catch (seedError) {
    console.error('Failed to run boot database seeding:', seedError);
    captureError(seedError);
  }
};

if (process.env.VERCEL !== '1') {
  app.listen(port, async () => {
    console.log(`=========================================`);
    console.log(`🍚 RiceGuard Backend Server running on port ${port}`);
    console.log(`🛠️ Mode: ${config.nodeEnv}`);
    console.log(`🧠 ML Core: ${config.mlServiceType}`);
    console.log(`=========================================`);
    await bootstrap();
  });
} else {
  // On Vercel, initialize database in background
  bootstrap();
}

export default app;
