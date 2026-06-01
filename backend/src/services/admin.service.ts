import prisma from '../repositories/db';

export interface ModelVersionProfile {
  id: string;
  name: string;
  version: string;
  status: string;
  accuracy: number;
  trafficSplit: number;
  createdAt: Date;
}

export class AdminService {
  private readonly defaultModels = [
    { name: "BlastDetection_Lite", version: "v2.1.0", status: "TESTING", accuracy: 98.4, trafficSplit: 10 },
    { name: "BlastDetection_Lite", version: "v2.0.4", status: "ACTIVE", accuracy: 96.1, trafficSplit: 90 },
    { name: "SheathBlight_Pro", version: "v1.8.2", status: "DEPRECATED", accuracy: 91.0, trafficSplit: 0 }
  ];

  public async seedModelsIfEmpty(): Promise<void> {
    const count = await prisma.modelVersion.count();
    if (count > 0) return;

    console.log('Seeding default model versions registry...');
    for (const item of this.defaultModels) {
      await prisma.modelVersion.create({
        data: item
      });
    }
  }

  public async getModelVersions(): Promise<ModelVersionProfile[]> {
    await this.seedModelsIfEmpty();
    return prisma.modelVersion.findMany({
      orderBy: { version: 'desc' }
    });
  }

  public async updateTrafficSplit(version: string, split: number): Promise<ModelVersionProfile> {
    await this.seedModelsIfEmpty();
    
    // Update target version split
    const updated = await prisma.modelVersion.update({
      where: { version },
      data: { trafficSplit: split }
    });

    // If making this split larger, we can dynamically balance other versions
    // For local mockup A/B testing dashboard, simply saving the split is sufficient.
    
    return updated;
  }

  public async getSystemMetrics() {
    const scanCount = await prisma.farmerScan.count();
    
    return {
      success: true,
      totalInferences: 1200000 + scanCount,
      avgLatencyMs: 142,
      successRatePct: 99.98,
      gpuLoadPct: 42,
      nodesCount: 5,
      status: "ALL NODES ACTIVE"
    };
  }
}
export default AdminService;
