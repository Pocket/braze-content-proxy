import { getApiKey } from './secretsManager';

/**
 * Check if the scheduled surface GUID provided is on the list
 * of surfaces needed by Braze.
 *
 * @param name
 */
export function validateScheduledSurfaceGuid(name: string): void {
  const allowlist = ['POCKET_HITS_EN_US', 'POCKET_HITS_DE_DE'];

  if (allowlist.includes(name)) {
    return;
  } else {
    throw new Error('Not a valid Scheduled Surface.');
  }
}

/**
 * Check if the date string provided is in YYYY-MM-DD format.
 *
 * @param date
 */
export function validateDate(date: string): void {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;

  if (!date || date.match(regEx) === null) {
    throw new Error(
      'Not a valid date. Please provide a date in YYYY-MM-DD format.'
    );
  }

  return;
}

/**
 * Check if the API request is authorised. We store an API key in AWS Secrets Manager
 * and provide it in Braze email templates so that API calls from Braze succeed.
 *
 * A rather simplistic way to ensure Pocket Hits data is not publicly available
 * before it is sent out, but it is enough for our use case here.
 *
 * @param key
 */
export async function validateApiKey(key: string): Promise<void> {
  const ERROR_MESSAGE = 'Please provide a valid API key';

  // Fail early on no key provided.
  if (!key) {
    throw new Error(ERROR_MESSAGE);
  }

  // Retrieve the canonical API key from AWS Secret Manager.
  const storedKey = await getApiKey();

  // Compare the stored key to the one provided by the request to the API.
  if (key !== storedKey) {
    throw new Error(ERROR_MESSAGE);
  }

  return;
}
