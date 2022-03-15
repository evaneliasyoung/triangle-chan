/**
 * @file      server.command.ts
 * @brief     Provides information about a server.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash} from 'discordx';
import EmbedService from '../../services/embed.service.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
} from '../../services/log.service.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class AboutServerCommand {
  #embedService = new EmbedService();

  @Slash('about-server', {description: 'Provides information about a server.'})
  async execute(interaction: CommandInteraction) {
    const {guild, member} = interaction;
    if (!guild)
      return await interaction
        .reply(`I'm having trouble finding the server you're talking about.`)
        .catch(InteractionFailedHandler);

    await interaction
      .reply({
        content: !!member ? `Here you go, ${member}!` : `Here you go!`,
        embeds: [await this.#embedService.aboutServerEmbed(guild)],
      })
      .catch(InteractionFailedHandler);
  }
}
