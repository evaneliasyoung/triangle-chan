/**
 * @file      counter.service.ts
 * @brief     The counter service.
 */

import {Collection, Guild, GuildMember} from 'discord.js';
import {Counter, GET_COUNTERS_BY_GUILD_ID} from '../database/database.js';
import {ECounterType} from '../database/entities/counter.entity.js';
import {Singleton} from '../models/singleton.model.js';
import {logger, MessageWithErrorHandlerGenerator} from './log.service.js';
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);

@Singleton
export default class CounterService {
  getMembers = async (guild: Guild) =>
    await guild.members.fetch({withPresences: true});

  getOnlineMembers = (members: Collection<string, GuildMember>) =>
    members.filter(({presence}) =>
      ['online', 'idle', 'dnd', 'invisible'].includes(presence?.status ?? '')
    );

  getPremiumMembers = (members: Collection<string, GuildMember>) =>
    members.filter(({premiumSince}) => premiumSince !== null);

  getRoledMembers = (
    members: Collection<string, GuildMember>,
    roleId: string
  ) =>
    members.filter(({roles}) => !!roles.cache.find(role => role.id === roleId));

  getCount = (
    members: Collection<string, GuildMember>,
    {name, roleId, type}: Counter
  ) =>
    (() => {
      switch (type) {
        case ECounterType.total:
          return members;
        case ECounterType.online:
          return this.getOnlineMembers(members);
        case ECounterType.boost:
          return this.getPremiumMembers(members);
        case ECounterType.role:
          if (roleId) return this.getRoledMembers(members, roleId);
          log.error('role Counter type without roleId', {name, type, roleId});
          return undefined;
        default:
          log.error('incorrect Counter type', {name, type});
          return undefined;
      }
    })()?.size;

  handleCounter = async (
    guild: Guild,
    members: Collection<string, GuildMember>,
    counter: Counter
  ) => {
    const {name, emojiId, channelId} = counter;

    const channel = await guild.channels.fetch(channelId);
    if (!channel) return log.error(`Channel[${channelId}] not found`);

    await channel
      .setName(`${emojiId} ${this.getCount(members, counter) ?? '?'} ${name}`)
      .catch(MessageWithErrorHandler('Failed to rename channel'));
  };

  handleGuild = async (guild: Guild) => {
    const {id} = guild;
    const counters = await GET_COUNTERS_BY_GUILD_ID(id);
    const members = await this.getMembers(guild);
    await Promise.all(
      counters.map(this.handleCounter.bind(this, guild, members))
    ).catch(MessageWithErrorHandler('Failed to process counter'));
  };
}
