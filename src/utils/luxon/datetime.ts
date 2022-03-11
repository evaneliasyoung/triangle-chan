/**
 * @file      datetime.ts
 * @brief     Luxon DateTime helper functions.
 *
 * @author    Evan Elias Young
 * @date      2022-03-09
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { DateTime } from 'luxon';
import { diffToString } from './duration.js';

/**
 * Returns the huge localized string representing the Luxon DateTime object.
 * @param date The Luxon DateTime object.
 * @returns The huge localized string representing the DateTime.
 */
export const dateToHugeString = (date: DateTime) =>
  date.toLocaleString(DateTime.DATETIME_HUGE);

/**
 * Returns the ISO string representing the Date.
 * @param date The Luxon DateTime object.
 * @returns The ISO string representing the Date.
 */
export const dateToISO = (date: DateTime) =>
  date.toFormat('yyyy-MM-dd');

/**
 * Returns the UTC converted Luxon DateTime object.
 * @param date The Luxon DateTime object.
 * @returns The UTC converted Luxon DateTime object.
 */
export const expandDateToUTC = (date: Date) =>
  DateTime.fromJSDate(date).setZone('utc', { keepLocalTime: false });

/**
 * Returns the huge localized DateTime string and humanized Duration string.
 * @param date The Luxon DateTime object.
 * @returns The huge localized DateTime string and humanized Duration string.
 */
export const dateToStringAndDuration = (date: DateTime) =>
  `${dateToHugeString(date)}\n${diffToString(date.diffNow())}`;
