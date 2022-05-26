/**
 * The properties of curated items that we need to fetch from Client API.
 */
export type CorpusItem = {
  url: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  authors: { name: string };
  publisher: string;
};

export interface ScheduledSurfaceItem {
  id: string;
  corpusItem: CorpusItem;
}

/**
 * The shape of the query returned by Client API that contains curated items
 * scheduled for a given day on a given Pocket Hits surface.
 */
export type ClientApiResponse = {
  data: {
    scheduledSurface: {
      items: ScheduledSurfaceItem[];
    };
  };
};

/**
 * A very lean Corpus Item type with just the data Pocket Hits emails need.
 */
export type TransformedCorpusItem = Omit<CorpusItem, 'authors'> & {
  // Unlike in the Client API response, the Braze Content Proxy response contains
  // a string that lists all the authors for each story, not an object.
  authors: string;
  // This value is the id of the Scheduled Surface Item, rather than the Corpus Item
  id: string;
};

/**
 * The response we serve from this proxy for Braze.
 */
export type BrazeContentProxyResponse = {
  stories: TransformedCorpusItem[];
};
