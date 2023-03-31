import gql from 'graphql-tag';
import {
  BrazeContentProxyResponse,
  TransformedCorpusItem,
} from './types';
import { ClientApiResponse } from '../graphql/types';
import { getResizedImageUrl } from '../utils';
import { getScheduledSurfaceStories } from '../graphql/client-api-proxy';


/**
 * Entry point to this module. Retrieves data from Client API and transforms it
 * to match expected schema.
 */
export async function getStories(
  date: string,
  scheduledSurfaceId: string
): Promise<BrazeContentProxyResponse> {
  // Retrieve data
  const data: ClientApiResponse | null = await getScheduledSurfaceStories(
    date,
    scheduledSurfaceId
  );

  const stories = data ? data.data.scheduledSurface.items : [];

  const transformedStories: TransformedCorpusItem[] = stories.map(function (
    item,
    index
  ) {
    return {
      // The id of the Scheduled Surface Item
      id: item.id,
      // Properties of the Corpus Item the proxy needs to make available for Braze
      ...item.corpusItem,
      // Resize images on the fly so that they don't distort emails when sent out.
      imageUrl: getResizedImageUrl(this[index].corpusItem.imageUrl),
      // Flatten the authors into a comma-separated string.
      authors: this[index].corpusItem.authors
        ?.map((author) => author.name)
        .join(', '),
    };
  },
  stories);

  return {
    stories: transformedStories,
  };
}

