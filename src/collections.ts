import { ClientApiResponse } from './types';
import gql from 'graphql-tag';
import { client } from './client-api-proxy';
import { getResizedImageUrl } from './utils';

/**
 * calls client API to get collections information
 * @param slug slug identifier of the collction
 * @returns collections and its story details required by braze
 */
async function getCollectionsFromGraph(
  slug: string
): Promise<ClientApiResponse | null> {
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

  if (!response.data?.getCollectionBySlug) {
    throw new Error(
      `No collection returned for ${slug}.`
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
      title: story.title,
      url: story.url,
      excerpt: story.excerpt,
      imageUrl: getResizedImageUrl(story.imageUrl),
      publisher: story.publisher,
      authors: story.authors.map(author => author.name)
    }
  });
  return {
    title: collection.title,
    excerpt: collection.excerpt,
    imageUrl: getResizedImageUrl(collection.imageUrl),
    intro: collection.intro,
    publishedAt: collection.publishedAt,
    stories: stories
  }
}

type BrazeCollections = {
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
