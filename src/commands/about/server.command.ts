/**
 * @file      server.command.ts
 * @brief     Provides information about a server.
 *
 * @author    Evan Elias Young
 * @date      2022-03-09
 * @date      2022-03-10
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import EmbedService from '../../services/embed.service.js';

@Discord()
export abstract class AboutServerCommand {
  #embedService = new EmbedService();

  @Slash('about-server', { description: 'Provides information about a server.' })
  async execute(interaction: CommandInteraction) {
    const { guild, member } = interaction;
    if (!guild) return await interaction.reply(`I'm having trouble finding the server you're talking about.`);

    await interaction.reply({
      content: !!member ? `Here you go, ${member}!` : `Here you go!`,
      embeds: [await this.#embedService.aboutServerEmbed(guild)]
    });
  }
}
