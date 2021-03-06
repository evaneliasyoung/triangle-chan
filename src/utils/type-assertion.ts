/**
 * @file      type-assertion.ts
 * @brief     Asserts a variable is a certain type.
 */

import {
  AnyChannel,
  GuildBasedChannel,
  TextChannel,
  VoiceChannel,
} from 'discord.js';
import {
  ECounterType,
  TCounterType,
} from '../database/entities/counter.entity.js';
import {ECommandCategory} from '../models/command-category.model.js';

export function isTextChannel(
  channel?: AnyChannel | GuildBasedChannel | null
): channel is TextChannel {
  return channel?.type === 'GUILD_TEXT';
}

export function isVoiceChannel(
  channel?: AnyChannel | GuildBasedChannel | null
): channel is VoiceChannel {
  return channel?.type === 'GUILD_VOICE';
}

export function isCommandCategory(
  text: string | undefined | null
): text is ECommandCategory {
  return typeof text === 'string' && text in ECommandCategory;
}

export function isCounterType(
  text: string | undefined | null
): text is TCounterType {
  return typeof text === 'string' && text in ECounterType;
}

export function asCounterType(text?: string | null): ECounterType {
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
