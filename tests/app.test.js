import app from '#src/app.js';
import request from 'supertest';

describe('API Endpoints', () => {
  // Health Check
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  // API Status
  describe('GET /api', () => {
    it('should return API status', async () => {
      const response = await request(app).get('/api').expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Acquisitions API is up and running!'
      );
    });
  });

  // Non-existent Route
  describe('GET /non-existent', () => {
    it('should return 404', async () => {
      const response = await request(app).get('/non-existent').expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});
