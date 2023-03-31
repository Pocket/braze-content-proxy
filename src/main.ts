import AWSXRay from 'aws-xray-sdk-core';
import xrayExpress from 'aws-xray-sdk-express';
import * as Sentry from '@sentry/node';
import https from 'https';
import express, { Express } from 'express';
import config from './config';
import { getStories } from './client-api-proxy';
import {
  validateApiKey,
  validateDate,
  validateScheduledSurfaceGuid,
} from './utils';
import { getCollection } from './collections';

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

export const app: Express = express();

//If there is no host header (really there always should be..) then use braze-content-proxy as the name
app.use(xrayExpress.openSegment('braze-content-proxy'));

//Set XRay to use the host header to open its segment name.
AWSXRay.middleware.enableDynamicNaming('*');

app.use(express.json());

app.get('/.well-known/server-health', (req, res) => {
  res.status(200).send('ok');
});

// This is the one and only endpoint planned for this repository,
// so a separate controller is not necessary.
app.get('/scheduled-items/:scheduledSurfaceID', async (req, res, next) => {
  // Enable two minute cache when in AWS.
  // The short-lived cache is to speed up the curators' workflow
  // if they need to make last-minute updates.
  if (config.app.environment !== 'development') {
    res.set('Cache-control', 'public, max-age=120');
  }

  // Get the scheduled surface GUID
  const scheduledSurfaceID = req.params.scheduledSurfaceID;
  // Get the date the stories are scheduled for
  const date = req.query.date as string;
  // Get the API key
  const apiKey = req.query.apikey as string;

  try {
    // Validate inputs
    validateScheduledSurfaceGuid(scheduledSurfaceID);
    validateDate(date);
    await validateApiKey(apiKey);

    // Fetch data
    return res.json(await getStories(date, scheduledSurfaceID));
  } catch (err) {
    // Let Express handle any errors
    next(err);
  }
});

app.get('/collection/:slug', async (req, res, next) => {
  // Enable two minute cache when in AWS.
  // The short-lived cache is to speed up the curators' workflow
  // if they need to make last-minute updates.
  if (config.app.environment !== 'development') {
    res.set('Cache-control', 'public, max-age=120');
  }

  // Get the scheduled surface GUID
  const slug = req.params.slug;
  //todo: option to set image dimensions
  // const imageWidth = req.query.image_width ?? config.images.width;
  // const imageHeight = req.query.image_height ?? config.images.height;

  // Get the API key
  const apiKey = req.query.apikey as string;

  try {
    await validateApiKey(apiKey);
    // Fetch data
    return res.json(await getCollection(slug));
  } catch (err) {
    // Let Express handle any errors
    next(err);
  }
});

//Make sure the express app has the xray close segment handler
app.use(xrayExpress.closeSegment());

/**
 * Use a custom error handler.
 *
 * Note: this middleware call needs to be placed last,
 * that is, below all other `app.use()` calls.
 *
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Log error to CloudWatch
  console.log(err);

  // Send error to Sentry
  Sentry.captureException(err);

  /**
   * If Pocket Hits stories are unavailable for whatever reason, the emails
   * should not be sent out. To achieve this, Braze needs to receive a 500 or 502
   * error if anything is amiss - if a 404 error is sent instead, Braze will
   * render an empty string and proceed with sending out the email.
   *
   * See Braze docs on Connected Content:
   * https://www.braze.com/docs/user_guide/personalization_and_dynamic_content/connected_content/making_an_api_call/
   */
  res.status(500).json({ error: err.message });
});

app
  .listen({ port: config.app.port }, () => {
    console.log(
      `🚀 Braze Content Proxy ready at http://localhost:${config.app.port}`
    );
  })
  .on('error', (_error) => {
    Sentry.captureException(_error.message);
    return console.log('Error: ', _error.message);
  });
