/**
 * @file      type-assertion.ts
 * @brief     Asserts a variable is a certain type.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-10
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { AnyChannel, GuildBasedChannel, TextChannel, VoiceChannel } from 'discord.js';
import { ECounterType, TCounterType } from '../database/entities/counter.entity.js';

export function isTextChannel(channel?: AnyChannel | GuildBasedChannel | null): channel is TextChannel {
  return channel?.type === 'GUILD_TEXT';
}

export function isVoiceChannel(channel?: AnyChannel | GuildBasedChannel | null): channel is VoiceChannel {
  return channel?.type === 'GUILD_VOICE';
}

export function textIsCounterType(text?: string | null): text is TCounterType {
  return text === 'total' ||
    text === 'online' ||
    text === 'boost' ||
    text === 'role';
}

export function textAsCounterType(text?: string | null): ECounterType {
  switch (text) {
    case 'total':
    case 'online':
    case 'boost':
    case 'role':
      return ECounterType[text];
    default:
      throw 'invalid text';
  }
}
