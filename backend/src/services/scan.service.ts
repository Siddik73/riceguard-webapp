import prisma from '../repositories/db';
import { MLInferenceService, InferenceResult } from './ml-inference.service';

export interface ScanRecord {
  id: string;
  disease: string;
  nameBn: string;
  confidence: number;
  severity: string;
  imagePath: string;
  fieldName: string;
  createdAt: Date;
}

export class ScanService {
  private mlInferenceService = new MLInferenceService();

  public async processNewScan(imagePath: string, fieldName: string = 'General Field'): Promise<ScanRecord> {
    // Run the VGG19 or Heuristic inference
    const inference: InferenceResult = await this.mlInferenceService.analyzeImage(imagePath);

    if (!inference.success) {
      throw new Error(inference.error || 'Failed to complete image analysis.');
    }

    // Persist scan history in local SQLite
    const scan = await prisma.farmerScan.create({
      data: {
        disease: inference.disease,
        nameBn: inference.nameBn,
        confidence: inference.confidence,
        severity: inference.severity,
        imagePath: imagePath.replace(/\\/g, '/'), // normalize path slashes
        fieldName: fieldName || 'General Field'
      }
    });

    return scan;
  }

  public async getScanHistory(): Promise<ScanRecord[]> {
    return prisma.farmerScan.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  public async clearHistory(): Promise<void> {
    await prisma.farmerScan.deleteMany();
  }
}
