/**
 * @file      channel.command.ts
 * @brief     Provides information about a channel.
 *
 * @author    Evan Elias Young
 * @date      2022-03-13
 * @date      2022-03-13
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import {CommandInteraction, GuildBasedChannel} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import EmbedService from '../../services/embed.service.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
} from '../../services/log.service.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class AboutBotCommand {
  #embedService = new EmbedService();

  @Slash('about-channel', {
    description: `Provides information about a channel.`,
  })
  async execute(
    @SlashOption('channel', {
      description: 'The channel to learn more about.',
      type: 'CHANNEL',
      required: false,
    })
    channel: GuildBasedChannel | null,
    interaction: CommandInteraction
  ) {
    await interaction
      .reply({
        embeds: [
          this.#embedService.aboutChannelEmbed(channel ?? interaction.channel!),
        ],
      })
      .catch(InteractionFailedHandler);
  }
}
