import * as Sentry from '@sentry/node';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import gql from 'graphql-tag';
import fetch from 'cross-fetch';
import config from './config';
import { BrazeContentProxyResponse, ClientApiResponse } from './types';

const client = new ApolloClient({
  link: new HttpLink({ fetch, uri: 'https://client-api.getpocket.com' }),
  cache: new InMemoryCache(),
  name: config.app.apolloClientName,
  version: config.app.version,
});

/**
 * Entry point to this module. Retrieves data from Client API and transforms it
 * to match expected schema.
 */
export async function getStories(
  date: string,
  scheduledSurfaceID: string
): Promise<BrazeContentProxyResponse> {
  let data: ClientApiResponse | null = null;

  try {
    data = await getData(date, scheduledSurfaceID);
  } catch (err) {
    console.log('Error retrieving Pocket Hits data!');
    console.log(err);
    Sentry.captureException(err);
  }

  return {
    stories: data ? data.data.scheduledSurface.items : [],
  };
}

/**
 * Calls Client API to get Pocket Hits stories for a given Pocket Hits surface
 * and date (in "YYYY-MM-DD" format).
 */
async function getData(
  date: string,
  scheduledSurfaceID: string
): Promise<ClientApiResponse | null> {
  const data = await client.query({
    query: gql`
      query PocketHits($date: Date!, $scheduledSurfaceId: ID!) {
        scheduledSurface(id: $scheduledSurfaceId) {
          items(date: $date) {
            corpusItem {
              url
              title
              excerpt
              imageUrl
              # author
              publisher
            }
          }
        }
      }
    `,
    variables: {
      date,
      scheduledSurfaceID,
    },
  });

  if (!data.data?.scheduledSurface?.items) {
    Sentry.captureException(
      new Error(
        `No data returned for ${scheduledSurfaceID} scheduled on ${date}.`
      )
    );

    return null;
  }

  return data;
}
