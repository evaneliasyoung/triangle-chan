/**
 * @file      permission.service.ts
 * @brief     Permission service.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { Permissions } from 'discord.js';
import { Client } from 'discordx';
import { CLIENT_ID } from '../env';
import { logger } from './log.service';
const log = logger(import.meta);

export enum EHasPerms {
  error = 1,
  failed,
  passed
}

export default class PermissionService {
  client: Client;

  constructor(_client: Client) { this.client = _client; }

  canClientPrepareReactMessage = async (guildId: string, channelId: string): Promise<EHasPerms.error | boolean> => {
    const guild = await this.client.guilds.fetch(guildId);
    if (!guild) {
      log.error(`Client could not find guild[${guildId}] in cache. Is it not cached?`);
      return EHasPerms.error;
    }

    const clientMember = await guild.members.fetch(CLIENT_ID);
    if (!clientMember) {
      log.error(`Couldn't find client member on guild[${guildId}]`);
      return EHasPerms.error;
    }

    const channel = await guild.channels.fetch(channelId);
    if (!channel) {
      log.error(`Client could not find channel[${channelId}] on guild[${guildId}].`);
      return EHasPerms.error;
    } else if (!channel.isText()) {
      log.error(`Channel[${channelId}] on guild[${guildId}] is not a text channel somehow.`);
      return EHasPerms.error;
    }

    const hasCorrectPerms = clientMember.permissions.has(
      [
        Permissions.FLAGS.READ_MESSAGE_HISTORY,
        Permissions.FLAGS.ADD_REACTIONS,
        Permissions.FLAGS.SEND_MESSAGES,
        Permissions.FLAGS.MANAGE_MESSAGES,
        Permissions.FLAGS.MANAGE_ROLES,
      ],
      true
    );

    return hasCorrectPerms;
  };
}
