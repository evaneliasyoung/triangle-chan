/**
 * @file      common.events.ts
 * @brief     Common events.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { ClientEvents, PresenceData } from 'discord.js';
import { Discord, Client, On } from 'discordx';
import { logger } from '../services/log.service.js';
import { BotInfo } from '../info.js';
const log = logger(import.meta);

@Discord()
abstract class CommonEvents {
  @On('ready')
  async onReady(
    _n: never[],
    client: Client,
    _guard: any
  ) {
    await client.guilds.fetch();

    const options = { guild: { log: true }, global: { log: true } };
    log.info('initializing commands', options);
    await client.initApplicationCommands(options);

    const presence: PresenceData = { activities: [BotInfo.activity] };
    log.info('setting presence', presence);
    client.user?.setPresence(presence);

    log.info('initializing permissions', { log: true });
    await client.initApplicationPermissions(true);
    log.info('bot ready');
  }

  @On('interactionCreate')
  async onInteraction(
    [interaction]: ClientEvents['interactionCreate'],
    client: Client,
    _guard: any
  ) {
    client.executeInteraction(interaction);
  }

  @On('messageCreate')
  async onMessage(
    [message]: ClientEvents['messageCreate'],
    client: Client,
    _guard: any
  ) {
    client.executeCommand(message);
  }
}
