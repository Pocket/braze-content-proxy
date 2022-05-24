import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import gql from 'graphql-tag';
import fetch from 'cross-fetch';
import config from './config';
import {
  BrazeContentProxyResponse,
  ClientApiResponse,
  TransformedCuratedItem,
} from './types';

const client = new ApolloClient({
  link: new HttpLink({ fetch, uri: config.clientApi.uri }),
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
  scheduledSurfaceId: string
): Promise<BrazeContentProxyResponse> {
  // Retrieve data
  const data: ClientApiResponse | null = await getData(
    date,
    scheduledSurfaceId
  );

  const stories = data ? data.data.scheduledSurface.items : [];

  const transformedStories: TransformedCuratedItem[] = stories.map(function (
    item,
    index
  ) {
    return {
      ...item,
      // Resize images on the fly so that they don't distort emails when sent out.
      imageUrl:
        `${config.images.protocol}://${config.images.host}/${config.images.width}x${config.images.height}/filters:${config.images.filters}/`.concat(
          encodeURIComponent(this[index].imageUrl)
        ),
      // Flatten the authors into a comma-separated string.
      authors: this[index].authors.map((author) => author.name).join(', '),
    };
  },
  stories);

  return {
    stories: transformedStories,
  };
}

/**
 * Calls Client API to get Pocket Hits stories for a given Pocket Hits surface
 * and date (in "YYYY-MM-DD" format).
 */
async function getData(
  date: string,
  scheduledSurfaceId: string
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
              authors {
                name
              }
              publisher
            }
          }
        }
      }
    `,
    variables: {
      date,
      scheduledSurfaceId,
    },
  });

  if (!data.data?.scheduledSurface?.items) {
    throw new Error(
      `No data returned for ${scheduledSurfaceId} scheduled on ${date}.`
    );
  }

  return data;
}
