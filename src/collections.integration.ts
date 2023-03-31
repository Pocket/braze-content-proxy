import { expect } from 'chai';
import config from './config';
import request from 'supertest';
import { app } from './main';

describe(`get collection test`, () => {
  const requestAgent = request.agent(app);
  it(`/get collection should return collection`, async () => {
    const response = await requestAgent.get(
      `/collection/this-is-test-slug?apikey=${config.aws.brazeApiKey}`
    );

    expect(response.statusCode).equals(200);
    expect(response.body).to.not.be.undefined;
    expect(response.body).to.not.be.null;
    expect(response.body).to.not.be.empty;
  });

  it('should return 500 if invalid api key is provided ', async () => {
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
