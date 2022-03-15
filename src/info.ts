/**
 * @file      info.ts
 * @brief     Discord bot information.
 */

import {ActivitiesOptions} from 'discord.js';
import {DateTime} from 'luxon';

export namespace BotInfo {
  export const source =
    '[GitHub](https://github.com/evaneliasyoung/triangle-chan)';
  export const tagline = `Triangle-Chan: The Tenaciously Tasteful Discord Tease`;
  export const library =
    '[discord.ts / Node](https://github.com/oceanroleplay/discord.ts)';
  export const version = '0.3.2-b2';
  export const date = DateTime.fromObject({year: 2022, month: 3, day: 14});
  export const activity: ActivitiesOptions = {
    name: 'Triangle',
    type: 'WATCHING',
  };
}
