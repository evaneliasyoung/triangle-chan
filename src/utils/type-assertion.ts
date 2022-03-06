/**
 * @file      type-assertion.ts
 * @brief     Asserts a variable is a certain type.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { AnyChannel, GuildBasedChannel, TextChannel } from 'discord.js';

export function isTextChannel(channel?: AnyChannel | GuildBasedChannel | null): channel is TextChannel {
  return channel?.type === 'GUILD_TEXT';
}
