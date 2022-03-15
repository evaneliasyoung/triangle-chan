/**
 * @file      guild.events.ts
 * @brief     Guild events.
 */

import {Client, ClientEvents} from 'discord.js';
import {Discord, On} from 'discordx';
import CounterService from '../services/counter.service.js';
import {logger} from '../services/log.service.js';
const log = logger(import.meta);

@Discord()
export abstract class GuildEvents {
  #counterService = new CounterService();

  @On('guildMemberAdd')
  async onMemberAdd(
    [member]: ClientEvents['guildMemberAdd'],
    _client: Client,
    _guard: any
  ) {
    log.debug('member add', {member: member.user.username});
    await this.#counterService.handleGuild(member.guild);
  }

  @On('guildMemberRemove')
  async onMemberRemove(
    [member]: ClientEvents['guildMemberRemove'],
    _client: Client,
    _guard: any
  ) {
    log.debug('member remove', {member: member.user.username});
    await this.#counterService.handleGuild(member.guild);
  }

  @On('guildMemberUpdate')
  async onMemberUpdate(
    [oldMember, newMember]: ClientEvents['guildMemberUpdate'],
    _client: Client,
    _guard: any
  ) {
    if (oldMember.premiumSince !== newMember.premiumSince) {
      log.debug('member update', {member: newMember.user.username});
      await this.#counterService.handleGuild(newMember.guild);
    }
  }

  @On('presenceUpdate')
  async onPresenceUpdate(
    [oldPresence, newPresence]: ClientEvents['presenceUpdate'],
    _client: Client,
    _guard: any
  ) {
    if (oldPresence?.status !== newPresence.status) {
      log.debug('presence update', {
        presence: newPresence.status ?? 'unknown',
        member: newPresence.user?.username,
      });
      if (newPresence.guild) {
        await this.#counterService.handleGuild(newPresence.guild);
      }
    }
  }

  @On('guildUpdate')
  async onGuildUpdate(
    [_oldGuild, newGuild]: ClientEvents['guildUpdate'],
    _client: Client,
    _guard: any
  ) {
    await this.#counterService.handleGuild(newGuild);
  }
}
