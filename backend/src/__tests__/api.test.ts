import request from 'supertest';
import express from 'express';
import cors from 'cors';
import apiRouter from '../routes/api';
import prisma from '../repositories/db';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

describe('RiceGuard Express Backend integration Tests', () => {
  beforeAll(async () => {
    // Sync models and seeds
    const count = await prisma.diseaseLibrary.count();
    if (count === 0) {
      await prisma.diseaseLibrary.create({
        data: {
          slug: 'blast',
          name: 'Rice Blast',
          nameBn: 'ধান ব্লাস্ট',
          scientificName: 'Magnaporthe oryzae',
          severity: 'HIGH',
          description: 'Fungal blast disease test description',
          descriptionBn: 'টেস্ট বিবরণী',
          symptoms: 'spots on leaves',
          symptomsBn: 'পাতায় দাগ',
          treatment: 'Apply Tricyclazole',
          treatmentBn: 'ট্রাইসাইক্লাজোল স্প্রে করুন',
          prevention: 'Wide spacing',
          preventionBn: 'সঠিক দূরত্ব'
        }
      });
    }
  });

  afterAll(async () => {
    // Close db connection to prevent hanging handles
    await prisma.$disconnect();
  });

  describe('GET /api/library', () => {
    it('should retrieve list of diseases successfully', async () => {
      const res = await request(app).get('/api/library');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/library/:slug', () => {
    it('should retrieve detailed profile for an existing disease slug', async () => {
      const res = await request(app).get('/api/library/blast');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.slug).toBe('blast');
      expect(res.body.data.name).toBe('Rice Blast');
    });

    it('should return 404 for a non-existent slug', async () => {
      const res = await request(app).get('/api/library/non-existent-disease-slug');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/models', () => {
    it('should retrieve system model versions registry', async () => {
      const res = await request(app).get('/api/admin/models');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
