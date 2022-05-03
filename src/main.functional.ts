import { expect } from 'chai';
import { app } from './main';
import request = require('supertest');

describe('functional tests', () => {
  describe('health endpoint', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/.well-known/server-health');
      expect(res.statusCode).equals(200);
      expect(res.text).is.not.null;
      expect(res.text).equals('ok');
    });
  });
});
