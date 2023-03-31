import { ClientApiResponse } from './types';
import gql from 'graphql-tag';
import { client } from './client';
import { getResizedImageUrl, NotFoundError } from './utils';

/**
 * calls client API to get collections information
 * @param slug slug identifier of the collction
 * @returns collections and its story details required by braze
 */
export async function getCollectionsFromGraph(
  slug: string
): Promise<any> {
  const response = await client.query({
    query: gql`
        query PocketCollections($slug: String!) {
            getCollectionBySlug(slug: $slug) {
                externalId
                title
                excerpt
                imageUrl
                intro
                publishedAt
                stories {
                    externalId
                    title
                    externalId
                    imageUrl
                    publisher
                    authors {
                        name
                    }
                    url
                }
            }
        }
    `,
    variables: {
      slug: slug,
    },
  });

  if(response?.errors?.[0].extensions?.code == 'NOT_FOUND') {
    throw new NotFoundError(
      `No collection found for ${slug}.`
    );
  }

  //if its not-found and we still don't have data, throw error
  if (!response.data?.getCollectionBySlug) {
    throw new Error(
      `server error: unable to fetch collections for slug: ${slug}.`
    );
  }

  return response;
}

/**
 * fetch collections and transform them to braze payload
 * @param response
 */
export async function getCollection(slug: string) {
  const response = await getCollectionsFromGraph(slug);
  return transformToBrazePayload(response);
}


function transformToBrazePayload(response, width?, height?) : BrazeCollections {
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

export type BrazeCollections = {
  title : string,
  excerpt : string,
  imageUrl : string,
  intro : string,
  publishedAt : string,
  stories: BrazeCollectionStory[]
}

type BrazeCollectionStory = {
  title : string,
  url : string,
  excerpt : string,
  imageUrl: string,
  publisher : string,
  authors : string[]
}
