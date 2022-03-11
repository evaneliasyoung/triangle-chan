/**
 * @file      info.ts
 * @brief     Discord bot information.
 *
 * @author    Evan Elias Young
 * @date      2022-03-09
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { ActivitiesOptions } from 'discord.js';
import { DateTime } from 'luxon';

export namespace BotInfo {
  export const tagline = `Triangle-Chan: The Tenaciously Tasteful Discord Tease`;
  export const library = '[discord.ts / Node](https://github.com/oceanroleplay/discord.ts)';
  export const version = '0.2.0-b11';
  export const date = DateTime.fromObject({ year: 2022, month: 3, day: 11 });
  export const activity: ActivitiesOptions = { name: 'Triangle', type: 'WATCHING' };
}
