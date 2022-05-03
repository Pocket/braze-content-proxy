import { expect } from 'chai';
import { app } from './main';

describe('functional tests', () => {
  /*eslint-disable */
  //there are no types-supertest, so we use require.
  //this throws lint error.
  const request = require('supertest');
  /*eslint-enable*/

  describe('health endpoint', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/.well-known/server-health');
      expect(res.statusCode).equals(200);
      expect(res.text).is.not.null;
      expect(res.text).equals('ok');
    });
  });
});
