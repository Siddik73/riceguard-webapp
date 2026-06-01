import { Request, Response } from 'express';
import { DiseaseLibraryService } from '../services/disease-library.service';
import { captureError } from '../config';

const libraryService = new DiseaseLibraryService();

export class DiseaseLibraryController {
  public async getLibrary(req: Request, res: Response): Promise<void> {
    try {
      const library = await libraryService.getLibrary();
      res.status(200).json({
        success: true,
        data: library
      });
    } catch (error: any) {
      captureError(error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve disease library.'
      });
    }
  }

  public async getDiseaseDetails(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const disease = await libraryService.getDiseaseBySlug(slug as string);

      if (!disease) {
        res.status(404).json({
          success: false,
          error: `Disease with slug '${slug}' not found.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: disease
      });
    } catch (error: any) {
      captureError(error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve disease details.'
      });
    }
  }
}
export default DiseaseLibraryController;
