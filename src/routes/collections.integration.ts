import { expect } from 'chai';
import config from '../config';
import request from 'supertest';
import { app } from '../main';
import { brazeCollectionsFixture, graphCollectionFixture } from './fixture';
import * as collection from './collections'
import { client } from '../graphql/client-api-proxy';

describe(`get collection test`, () => {
  const requestAgent = request.agent(app);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`/get collection should return braze collection payload`, async () => {
    const testSlug = 'the-world-as-explained-by-pop-culture';
    // spying on the getStories function to make it return a mock response
    jest.spyOn(client,'query').mockResolvedValue(graphCollectionFixture as any);
    const response = await requestAgent.get(
      `/collection/${testSlug}?apikey=${config.aws.brazeApiKey}`
    );
    expect(response.statusCode).equals(200);
    expect(response.body).to.deep.equal(brazeCollectionsFixture);
    expect(response.headers['cache-control']).to.not.be.undefined;
    expect(response.headers['cache-control']).to.equal('public, max-age=120');
  });

  it('should return 404 for not found collections', async () => {
    const testSlug = 'this-is-not-found-slug';
    const notFoundErrorResponse = {
      "errors": [
        {
          "message": "Error - Not Found: bla-string",
          "path": [
            "getCollectionBySlug"
          ],
          "extensions": {
            "code": "NOT_FOUND",
            "serviceName": "collection"
          }
        }
      ],
    }
    jest.spyOn(client,'query').mockResolvedValue(notFoundErrorResponse as any);
    const response = await requestAgent.get(
      `/collection/${testSlug}?apikey=${config.aws.brazeApiKey}`
    );
    expect(response.statusCode).equals(404);
  });

  it('should return 500 if invalid api key is provided ', async () => {
    const serverError = {
      "errors": [
        {
          "message": "something went wrong",
          "path": [
            "getCollectionBySlug"
          ],
          "extensions": {
            "code": "INTERNAL_SERVER_ERROR",
            "serviceName": "collection"
          }
        }
      ],
    };
    const response = await requestAgent.get(
      `/collection/this-is-test-slug?apikey=invalid-api-key`
    );
    expect(response.statusCode).equals(500);
    expect(response.body.error).to.not.be.undefined;
    expect(response.body.error).to.equal(
      config.app.INVALID_API_KEY_ERROR_MESSAGE
    );
  });
});
