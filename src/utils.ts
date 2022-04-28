/**
 *
 *
 * @param name
 */
export async function validateScheduledSurfaceGuid(
  name: string
): Promise<void> {
  const allowlist = ['POCKET_HITS_EN_US', 'POCKET_HITS_DE_DE'];

  if (allowlist.includes(name)) {
    return;
  } else {
    throw new Error('Not a valid Scheduled Surface');
  }
}

/**
 *
 * @param date
 */
export async function validateDate(date: string): Promise<void> {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;

  if (date.match(regEx) === null) {
    throw new Error(
      'Not a valid date. Please provide a date in YYYY-MM-DD format.'
    );
  }

  return;
}
