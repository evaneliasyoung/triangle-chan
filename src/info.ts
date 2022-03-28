/**
 * @file      info.ts
 * @brief     Discord bot information.
 */

import {ActivitiesOptions} from 'discord.js';
import {DateTime} from 'luxon';

export const BotInfo = {
  source: '[GitHub](https://github.com/evaneliasyoung/triangle-chan)',
  tagline: 'Triangle-Chan: The Tenaciously Tasteful Discord Tease',
  library: '[discord.ts / Node](https://github.com/oceanroleplay/discord.ts)',
  version: '0.3.2',
  date: DateTime.fromObject({year: 2022, month: 3, day: 14}),
  activity: {
    name: 'Triangle',
    type: 'WATCHING',
  } as ActivitiesOptions,
};
