/**
 * A very lean Curated Item type with just the data Pocket Hits emails need.
 */
export type CuratedItem = {
  url: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  // TODO: add it when it is available on Curated Corpus API
  // author: string;
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
 * The response we serve from this proxy for Braze.
 */
export type BrazeContentProxyResponse = {
  stories: CuratedItem[];
};
