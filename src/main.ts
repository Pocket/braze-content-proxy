import AWSXRay from 'aws-xray-sdk-core';
import xrayExpress from 'aws-xray-sdk-express';
import * as Sentry from '@sentry/node';
import https from 'https';
import express, { Request } from 'express';
import config from './config';
import { getStories } from './client-api-proxy';

// TODO: copy .aws directory from client-api

//Set XRAY to just log if the context is missing instead of a runtime error
AWSXRay.setContextMissingStrategy('LOG_ERROR');

//Add the AWS XRAY ECS plugin that will add ecs specific data to the trace
AWSXRay.config([AWSXRay.plugins.ECSPlugin]);

//Capture all https traffic this service sends
//This is to auto capture node fetch requests (like to client API)
AWSXRay.captureHTTPsGlobal(https, true);

//Capture all promises that we make
AWSXRay.capturePromise();

// Initialize sentry
// TODO: read sentry confluence page
Sentry.init({
  ...config.sentry,
  debug: config.sentry.environment == 'development',
});

const app = express();

//If there is no host header (really there always should be..) then use braze-content-proxy as the name
app.use(xrayExpress.openSegment('braze-content-proxy'));

//Set XRay to use the host header to open its segment name.
AWSXRay.middleware.enableDynamicNaming('*');

app.use(express.json());

app.get('/.well-known/server-health', (req, res) => {
  res.status(200).send('ok');
});

// The parameters we expect end users to provide
interface BrazePocketHitsQueryParams {
  date: string;
}

enum BrazePocketHitsParams {
  scheduledSurfaceID = 'scheduledSurfaceID',
}

type BrazePocketHitsRequest = Request<
  Record<BrazePocketHitsParams, 'string'>,
  any,
  any,
  BrazePocketHitsQueryParams
>;

const basePath = '/scheduled-items/';

app.get(
  `${basePath}:${BrazePocketHitsParams.scheduledSurfaceID}`,
  async (req: BrazePocketHitsRequest, res) => {
    // // enable 30 minute cache when in AWS
    // if (config.app.environment !== 'development') {
    //   res.set('Cache-control', 'public, max-age=120');
    // }

    //TODO: implement caching here?

    res.set('Cache-control', 'public, max-age=120');

    const date = req.query.date;
    const scheduledSurfaceId = req.params.scheduledSurfaceID;

    // console.log(req.params.scheduledSurfaceID, date);

    res.send({ scheduledSurfaceId, date });

    // res.json(await getStories(date, scheduledSurfaceID));
  }
);

//Make sure the express app has the xray close segment handler
app.use(xrayExpress.closeSegment());

app.listen({ port: config.app.port }, () => {
  console.log(
    `🚀 Braze Content Proxy ready at http://localhost:${config.app.port}`
  );
});
