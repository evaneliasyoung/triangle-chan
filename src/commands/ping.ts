/**
 * @file      ping.ts
 * @brief     Pings the server to determine interaction delay.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash} from 'discordx';
import {DateTime, Duration} from 'luxon';
import {
  InteractionFailedHandlerGenerator,
  logger,
} from '../services/log.service.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export default abstract class PingCommand {
  @Slash('ping', {
    description: 'Pings the server to determine interaction delay.',
  })
  async ping(interaction: CommandInteraction) {
    const start: DateTime = DateTime.fromMillis(interaction.createdTimestamp);
    const diff: Duration = start.diffNow();
    const ms: number = diff.as('milliseconds') * -1;

    await interaction
      .reply({ephemeral: true, content: `Pong! - Time taken: **${ms}ms**`})
      .catch(InteractionFailedHandler);
  }
}
