/**
 * @file      common.events.ts
 * @brief     Common events.
 */

import {ClientEvents, PresenceData} from 'discord.js';
import {Discord, Client, On} from 'discordx';
import {logger} from '../services/log.service.js';
import {BotInfo} from '../info.js';
import {SafeAny} from '../models/object.types.js';
const log = logger(import.meta);

@Discord()
export default abstract class CommonEvents {
  @On('ready')
  async onReady(_n: never[], client: Client, _guard: SafeAny) {
    await client.guilds.fetch();

    const options = {guild: {log: true}, global: {log: true}};
    log.info('initializing commands', options);
    await client.initApplicationCommands(options);

    const presence: PresenceData = {activities: [BotInfo.activity]};
    log.info('setting presence', presence);
    client.user?.setPresence(presence);

    log.info('initializing permissions', {log: true});
    await client.initApplicationPermissions(true);
    log.info('bot ready');
  }

  @On('interactionCreate')
  async onInteraction(
    [interaction]: ClientEvents['interactionCreate'],
    client: Client,
    _guard: SafeAny
  ) {
    client.executeInteraction(interaction);
  }

  @On('messageCreate')
  async onMessage(
    [message]: ClientEvents['messageCreate'],
    client: Client,
    _guard: SafeAny
  ) {
    client.executeCommand(message);
  }
}
