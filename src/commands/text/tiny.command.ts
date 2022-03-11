/**
 * @file      tiny.command.ts
 * @brief     Makes your text tiny.
 *
 * @author    Evan Elias Young
 * @date      2022-03-11
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { InteractionFailedHandlerGenerator, logger } from '../../services/log.service.js';
import { remapCharacters } from '../../utils/native/string.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class TextTinyCommand {
  static match: string[] = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  static tiny: string[] = '⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ'.split('');

  @Slash('text-tiny', { description: 'Makes your text tiny.' })
  async execute(
    @SlashOption('text', { description: 'The text you want to be tiny.' })
    text: string,
    interaction: CommandInteraction
  ) {
    await interaction
      .reply(`Here you go!\n${remapCharacters(text, TextTinyCommand.match, TextTinyCommand.tiny)}`)
      .catch(InteractionFailedHandler);
  }
}
