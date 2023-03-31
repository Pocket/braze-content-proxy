import { getCollectionsFromGraph } from '../graphql/client-api-proxy';
import { getResizedImageUrl } from '../utils';
import { BrazeCollections } from './types';


/**
 * fetch collections and transform them to braze payload
 * @param response
 */
export async function getCollection(slug: string) {
  const response = await getCollectionsFromGraph(slug);
  return transformToBrazePayload(response);
}


function transformToBrazePayload(response) : BrazeCollections {
  const collection = response.data.getCollectionBySlug;
  const stories = collection.stories.map(story => {
    return {
      ...story,
      imageUrl: getResizedImageUrl(story.imageUrl),
      authors: story.authors.map(author => author.name)
    }
  });
  return {
    ...collection,
    imageUrl: getResizedImageUrl(collection.imageUrl),
    stories: stories
  }
}

