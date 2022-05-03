import { validateDate, validateScheduledSurfaceGuid } from './utils';

describe('function validateScheduledSurfaceGuid', () => {
  it('Allows a valid Pocket Hits surface', () => {
    expect(() => {
      validateScheduledSurfaceGuid('POCKET_HITS_EN_US');
    }).not.toThrow();
  });

  it('Disallows an empty string', () => {
    expect(() => {
      validateScheduledSurfaceGuid('');
    }).toThrowError('Not a valid Scheduled Surface');
  });

  it('Disallows an invalid surface GUID', () => {
    expect(() => {
      validateScheduledSurfaceGuid('MADE_UP_GUID_GOES_HERE');
    }).toThrowError('Not a valid Scheduled Surface.');
  });
});

describe('function validateDate', () => {
  it('Allows a date in YYYY-MM-DD format', () => {
    expect(() => {
      validateDate('2050-01-01');
    }).not.toThrow();
  });

  it('Disallows an empty date value', () => {
    expect(() => {
      validateDate('');
    }).toThrowError(
      'Not a valid date. Please provide a date in YYYY-MM-DD format.'
    );
  });

  it('Disallows a date in invalid format', () => {
    expect(() => {
      validateDate('29 Jan, 1900');
    }).toThrowError(
      'Not a valid date. Please provide a date in YYYY-MM-DD format.'
    );
  });
});
