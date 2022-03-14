/**
 * @file      permissions.ts
 * @brief     Permission mapping.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import {Permissions} from 'discord.js';

export const PermissionMappings: Map<bigint, string> = new Map([
  [Permissions.FLAGS.READ_MESSAGE_HISTORY, 'READ_MESSAGE_HISTORY'],
  [Permissions.FLAGS.BAN_MEMBERS, 'BAN_MEMBERS'],
  [Permissions.FLAGS.KICK_MEMBERS, 'KICK_MEMBERS'],
  [Permissions.FLAGS.MANAGE_GUILD, 'MANAGE_GUILD'],
  [Permissions.FLAGS.MANAGE_ROLES, 'MANAGE_ROLES'],
  [Permissions.FLAGS.MANAGE_MESSAGES, 'MANAGE_MESSAGES'],
  [Permissions.FLAGS.ADD_REACTIONS, 'ADD_REACTIONS'],
  [Permissions.FLAGS.SEND_MESSAGES, 'SEND_MESSAGES'],
  [Permissions.FLAGS.ATTACH_FILES, 'ATTACH_FILES'],
  [Permissions.FLAGS.EMBED_LINKS, 'EMBED_LINKS'],
]);
