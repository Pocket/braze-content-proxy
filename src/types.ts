/**
 * The properties of curated items that we need to fetch from Client API.
 */
export type CuratedItem = {
  url: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  authors: { name: string };
  publisher: string;
};

/**
 * The shape of the query returned by Client API that contains curated items
 * scheduled for a given day on a given Pocket Hits surface.
 */
export type ClientApiResponse = {
  data: {
    scheduledSurface: {
      items: CuratedItem[];
    };
  };
};

/**
 * A very lean Curated Item type with just the data Pocket Hits emails need.
 *
 * Unlike in the Client API response, the Braze Content Proxy response contains
 * a string that lists all the authors for each story, not an object.
 */
export type TransformedCuratedItem = Omit<CuratedItem, 'authors'> & {
  authors: string;
};

/**
 * The response we serve from this proxy for Braze.
 */
export type BrazeContentProxyResponse = {
  stories: TransformedCuratedItem[];
};
