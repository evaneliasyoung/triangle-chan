/**
 * @file      duration.ts
 * @brief     Luxon Duration helper functions.
 */

import humanizeDuration from 'humanize-duration';
import {DateTime, Duration} from 'luxon';

/**
 * Returns the humanized string of the Duration.
 * @param diff The Luxon Duration object.
 * @returns The humanized string of the Duration.
 */
export const diffToString = (diff: Duration) =>
  `${humanizeDuration(diff.milliseconds, {conjunction: ' and '})} ago`;
