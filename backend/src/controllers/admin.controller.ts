import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { captureError } from '../config';

const adminService = new AdminService();

export class AdminController {
  public async getModels(req: Request, res: Response): Promise<void> {
    try {
      const models = await adminService.getModelVersions();
      res.status(200).json({
        success: true,
        data: models
      });
    } catch (error: any) {
      captureError(error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve model registry.'
      });
    }
  }

  public async updateSplit(req: Request, res: Response): Promise<void> {
    try {
      const { version, split } = req.body;

      if (!version || split === undefined) {
        res.status(400).json({
          success: false,
          error: 'Version and traffic split percentage are required parameters.'
        });
        return;
      }

      const parsedSplit = parseInt(split, 10);
      if (isNaN(parsedSplit) || parsedSplit < 0 || parsedSplit > 100) {
        res.status(400).json({
          success: false,
          error: 'Traffic split must be an integer between 0 and 100.'
        });
        return;
      }

      const updated = await adminService.updateTrafficSplit(version, parsedSplit);
      
      res.status(200).json({
        success: true,
        message: `Traffic routing split updated successfully for ${version}.`,
        data: updated
      });
    } catch (error: any) {
      captureError(error);
      res.status(500).json({
        success: false,
        error: 'Failed to update traffic split configuration.'
      });
    }
  }

  public async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await adminService.getSystemMetrics();
      res.status(200).json(stats);
    } catch (error: any) {
      captureError(error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve system metrics.'
      });
    }
  }
}
export default AdminController;
