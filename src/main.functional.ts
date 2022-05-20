import { expect } from 'chai';
import { app } from './main';
import request from 'supertest';

describe('functional tests', () => {
  const requestAgent = request.agent(app);

  describe('health endpoint', () => {
    it('should return 200 OK', async () => {
      const response = await requestAgent.get('/.well-known/server-health');

      expect(response.statusCode).equals(200);
      expect(response.text).is.not.null;
      expect(response.text).equals('ok');
    });
  });
});
