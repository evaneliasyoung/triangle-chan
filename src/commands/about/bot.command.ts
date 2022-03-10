/**
 * @file      bot.command.ts
 * @brief     The bots information.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-10
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import EmbedService from '../../services/embed.service.js';

@Discord()
export abstract class AboutBotCommand {
  #embedService = new EmbedService();

  @Slash('about-bot', { description: `The bot's information.` })
  async execute(interaction: CommandInteraction) {
    const { client } = interaction;
    const { user } = client;

    if (!user) return await interaction.reply(`Oh no! I can't find myself in the Discord registry!`);

    await interaction.reply({ embeds: [this.#embedService.aboutBotEmbed(client)] });
  }
}
