import { Request, Response } from 'express';
import { ScanService } from '../services/scan.service';
import { captureError } from '../config';

const scanService = new ScanService();

export class ScanController {
  public async scanLeaf(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No image file uploaded.' });
        return;
      }

      const fieldName = req.body.fieldName || 'General Field';
      const imagePath = req.file.path;

      console.log(`[Scan API]: Received image '${imagePath}' for field '${fieldName}'`);
      
      const record = await scanService.processNewScan(imagePath, fieldName);
      
      res.status(201).json({
        success: true,
        data: record
      });
    } catch (error: any) {
      captureError(error);
      res.status(500).json({
        success: false,
        error: error.message || 'An error occurred during leaf analysis.'
      });
    }
  }

  public async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const history = await scanService.getScanHistory();
      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error: any) {
      captureError(error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve scan history.'
      });
    }
  }

  public async clearAllHistory(req: Request, res: Response): Promise<void> {
    try {
      await scanService.clearHistory();
      res.status(200).json({
        success: true,
        message: 'Scan history cleared successfully.'
      });
    } catch (error: any) {
      captureError(error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear scan history.'
      });
    }
  }
}
export default ScanController;
