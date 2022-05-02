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
