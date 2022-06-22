import { expect } from 'chai';
import { app } from './main';
import request from 'supertest';
import config from './config';
import sinon from 'sinon';
import * as Sentry from '@sentry/node';

import * as clientApiProxy from './client-api-proxy';

describe('main.integration.ts', () => {
  const requestAgent = request.agent(app);

  beforeEach(() => {
    sinon.restore();
  });

  afterAll(() => {
    sinon.restore();
  });

  describe('health endpoint', () => {
    it('should return 200 OK', async () => {
      const response = await requestAgent.get('/.well-known/server-health');

      expect(response.statusCode).equals(200);
      expect(response.text).is.not.null;
      expect(response.text).equals('ok');
    });
  });

  describe('/scheduled-items/:scheduledSurfaceID?date=date&apikey=apikey', () => {
    const testNewTab = 'POCKET_HITS_EN_US';
    const testDate = '2050-01-01';
    const validUrl = `/scheduled-items/${testNewTab}?date=${testDate}&apikey=${config.aws.brazeApiKey}`;

    const testStories = {
      stories: [
        {
          id: '123-abc',
          url: 'www.test-url.com',
          title: 'test-title',
          excerpt: 'test-excerpt',
          imageUrl: 'www.test-image-url.com',
          authors: 'test-author',
          publisher: 'test-publisher',
        },
        {
          id: '456-cde',
          url: 'www.second-test-url.com',
          title: 'second-test-title',
          excerpt: 'second-test-excerpt',
          imageUrl: 'www.second-test-image-url.com',
          authors: 'second-test-author',
          publisher: 'second-test-publisher',
        },
      ],
    };
    it('logs error to Sentry if getStories takes more than 2 seconds', async () => {
      const sentryStub = sinon.stub(Sentry, Sentry.captureException);
      // stub the getStories to be > 2 seconds
      // invoke
      expect(sentryStub.callCount).to.equal(1);
    });
    it('does not log error if getStories takes less than 2 seconds', async () => {
      const sentryStub = sinon.stub(Sentry, Sentry.captureException);
      // stub the getStories to be > 2 seconds
      // invoke
      expect(sentryStub.callCount).to.equal(0);
    });

    it('should return 200 OK and correct headers when valid query params are provided', async () => {
      const response = await requestAgent.get(validUrl);

      expect(response.statusCode).equals(200);
      // checking if the cache-control header has been set correctly
      expect(response.headers['cache-control']).to.not.be.undefined;
      expect(response.headers['cache-control']).to.equal('public, max-age=120');
    });

    it('should return correct data when valid query params are provided', async () => {
      // spying on the getStories function to make it return a mock response
      jest.spyOn(clientApiProxy, 'getStories').mockResolvedValue(testStories);

      const response = await requestAgent.get(validUrl);

      expect(response.statusCode).equals(200);
      expect(response.body).to.deep.equal(testStories);
    });

    it('should return 404 for non-existent url ', async () => {
      const response = await requestAgent.get('/not-found');

      expect(response.statusCode).equals(404);
    });

    it('should return 500 if incorrect scheduled surface is provided ', async () => {
      const response = await requestAgent.get(
        `/scheduled-items/NEW_TAB_DOES_NOT_EXIST`
      );

      expect(response.statusCode).equals(500);
      expect(response.body.error).to.not.be.undefined;
      expect(response.body.error).to.equal('Not a valid Scheduled Surface.');
    });

    it('should return 500 if incorrect date format is provided ', async () => {
      const response = await requestAgent.get(
        `/scheduled-items/${testNewTab}?date=20220524`
      );

      expect(response.statusCode).equals(500);
      expect(response.body.error).to.not.be.undefined;
      expect(response.body.error).to.equal(
        'Not a valid date. Please provide a date in YYYY-MM-DD format.'
      );
    });

    it('should return 500 if invalid api key is provided ', async () => {
      const response = await requestAgent.get(
        `/scheduled-items/${testNewTab}?date=${testDate}&apikey=invalid-key`
      );

      expect(response.statusCode).equals(500);
      expect(response.body.error).to.not.be.undefined;
      expect(response.body.error).to.equal(
        config.app.INVALID_API_KEY_ERROR_MESSAGE
      );
    });
  });
});
