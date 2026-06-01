import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ScanController } from '../controllers/scan.controller';
import { DiseaseLibraryController } from '../controllers/disease-library.controller';
import { AdminController } from '../controllers/admin.controller';

const router = Router();

// Configure Multer storage to write uploaded images to backend/uploads/
const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate distinct filenames to prevent collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'leaf-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Allow only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!') as any, false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Controllers
const scanController = new ScanController();
const libraryController = new DiseaseLibraryController();
const adminController = new AdminController();

// --- API Route Definitions ---

// Leaf Scan & Diagnostic Routes
router.post('/scan', upload.single('image'), scanController.scanLeaf.bind(scanController));
router.get('/history', scanController.getHistory.bind(scanController));
router.delete('/history', scanController.clearAllHistory.bind(scanController));

// Disease Encyclopedia Routes
router.get('/library', libraryController.getLibrary.bind(libraryController));
router.get('/library/:slug', libraryController.getDiseaseDetails.bind(libraryController));

// Admin Model & Stats telemetry Routes
router.get('/admin/models', adminController.getModels.bind(adminController));
router.post('/admin/models/split', adminController.updateSplit.bind(adminController));
router.get('/admin/metrics', adminController.getStats.bind(adminController));

export default router;
