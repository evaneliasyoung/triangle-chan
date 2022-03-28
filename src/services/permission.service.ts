/**
 * @file      permission.service.ts
 * @brief     Permission service.
 */

// import {APIInteractionGuildMember} from 'discord-api-types/payloads/v9/_interactions/base';
import {GuildMember, Permissions} from 'discord.js';
import {Client} from 'discordx';
import {CLIENT_ID} from '../env.js';
import {Singleton} from '../models/singleton.model.js';
import {logger} from './log.service.js';
const log = logger(import.meta);

const {
  READ_MESSAGE_HISTORY,
  ADD_REACTIONS,
  SEND_MESSAGES,
  MANAGE_MESSAGES,
  MANAGE_ROLES,
  MANAGE_CHANNELS,
} = Permissions.FLAGS;

export enum EHasPerms {
  error = 1,
  failed,
  passed,
}

@Singleton
export default class PermissionService {
  client?: Client;

  hasPermissions = (
    {permissions}: GuildMember,
    checkAdmin: boolean,
    ...perms: bigint[]
  ) => permissions.has(perms, checkAdmin);

  memberHasPermissions = (
    member: GuildMember | null,
    checkAdmin: boolean,
    ...perms: bigint[]
  ): boolean => {
    if (!member) {
      log.debug('Member not found on interaction');
      return false;
    }
    if (!('guild' in member)) {
      log.debug('GuildMember not found on interaction');
      return false;
    }
    return this.hasPermissions(member, checkAdmin, ...perms);
  };

  canManageRoles = (member: GuildMember | null, checkAdmin?: boolean) =>
    this.memberHasPermissions(member, checkAdmin ?? false, MANAGE_ROLES);

  canManageChannels = (member: GuildMember | null, checkAdmin?: boolean) =>
    this.memberHasPermissions(member, checkAdmin ?? false, MANAGE_CHANNELS);

  canClientPrepareReactMessage = async (
    guildId: string,
    channelId: string
  ): Promise<EHasPerms.error | boolean> => {
    if (!this.client) {
      log.error('Client could not be found. It it set?');
      return EHasPerms.error;
    }
    const guild = await this.client.guilds.fetch(guildId);
    if (!guild) {
      log.error(
        `Client could not find guild[${guildId}] in cache. Is it not cached?`
      );
      return EHasPerms.error;
    }

    const clientMember = await guild.members.fetch(CLIENT_ID);
    if (!clientMember) {
      log.error(`Couldn't find client member on guild[${guildId}]`);
      return EHasPerms.error;
    }

    const channel = await guild.channels.fetch(channelId);
    if (!channel) {
      log.error(
        `Client could not find channel[${channelId}] on guild[${guildId}].`
      );
      return EHasPerms.error;
    } else if (!channel.isText()) {
      log.error(
        `Channel[${channelId}] on guild[${guildId}] is not a text channel somehow.`
      );
      return EHasPerms.error;
    }

    return this.hasPermissions(
      clientMember,
      true,
      READ_MESSAGE_HISTORY,
      ADD_REACTIONS,
      SEND_MESSAGES,
      MANAGE_MESSAGES,
      MANAGE_ROLES
    );
  };
}
