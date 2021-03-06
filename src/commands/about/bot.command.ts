/**
 * @file      bot.command.ts
 * @brief     Provides information about Triangle-Chan.
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
export abstract class AboutBotCommand {
  #embedService = new EmbedService();

  @Slash('about-bot', {
    description: 'Provides information about Triangle-Chan.',
  })
  async execute(interaction: CommandInteraction) {
    const {client} = interaction;
    const {user} = client;

    if (!user)
      return await interaction
        .reply("Oh no! I can't find myself in the Discord registry!")
        .catch(InteractionFailedHandler);

    await interaction
      .reply({embeds: [this.#embedService.aboutBotEmbed(client)]})
      .catch(InteractionFailedHandler);
  }
}
