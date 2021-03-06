/**
 * @file      small-caps.command.ts
 * @brief     sPonGifIeS YOur tExt.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {
  InteractionFailedHandlerGenerator,
  logger,
} from '../../services/log.service.js';
import {toRandomCase} from '../../utils/native/string.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class TextSpongifyCommand {
  @Slash('text-spongify', {description: 'sPonGifIeS YOur tExt.'})
  async execute(
    @SlashOption('text', {description: 'The text you want to sPonGifY.'})
    text: string,
    interaction: CommandInteraction
  ) {
    await interaction
      .reply(`Here you go!\n${toRandomCase(text)}`)
      .catch(InteractionFailedHandler);
  }
}
