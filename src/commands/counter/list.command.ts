/**
 * @file      list.command.ts
 * @brief     List all your counter and the purpose of each.
 */

import {CommandInteraction, MessageEmbed} from 'discord.js';
import {Discord, Slash} from 'discordx';
import {GET_COUNTERS_BY_GUILD_ID} from '../../database/database.js';
import EmbedService from '../../services/embed.service.js';
import {chunk} from '../../utils/native/chunk.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
  MessageWithErrorHandlerGenerator,
} from '../../services/log.service.js';
import PermissionService from '../../services/permission.service.js';
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class CounterListCommand {
  #embedService = new EmbedService();
  #permissionService = new PermissionService();

  @Slash('counter-list', {
    description: 'List all your counter and the purpose of each.',
  })
  async execute(interaction: CommandInteraction) {
    if (!interaction.guildId)
      return await interaction.reply({
        ephemeral: true,
        content: 'Hey! `/counter-list` can only be used in a server.',
      });

    if (!this.#permissionService.canManageChannels(interaction.member))
      return await interaction
        .reply({
          ephemeral: true,
          content: "Hey! You don't have permission to use `/counter-create`.",
        })
        .catch(InteractionFailedHandler);

    const counters = await GET_COUNTERS_BY_GUILD_ID(interaction.guildId).catch(
      MessageWithErrorHandler(
        `Failed to get counters for guild[${interaction.guildId}]`
      )
    );

    if (!counters || !counters.length) {
      log.debug(`Guild[${interaction.guildId}] did not have any counters.`);
      return await interaction
        .reply(
          "Hey! It appears that there aren't any counters for this server... however, if there ARE supposed to be some and you see this please wait a second and try again."
        )
        .catch(InteractionFailedHandler);
    }

    await interaction
      .reply(
        'Hey! Let me build these embeds for you real quick and send them...'
      )
      .catch(InteractionFailedHandler);

    const embeds: MessageEmbed[] = [
      ...(await Promise.all(
        counters.map(
          this.#embedService.counterEmbed.bind(
            this.#embedService,
            interaction.client
          )
        )
      )),
    ];

    for (const embed of chunk(embeds, 10)) {
      interaction.channel
        ?.send({embeds: embed})
        .catch(() =>
          log.error(
            `Failed to send counter embeds to channel[${interaction.channel?.id}] in guild[${interaction.guildId}]`
          )
        );
    }
  }
}
