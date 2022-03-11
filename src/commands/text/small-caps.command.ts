/**
 * @file      small-caps.command.ts
 * @brief     Makes your text into small caps.
 *
 * @author    Evan Elias Young
 * @date      2022-03-11
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { InteractionFailedHandlerGenerator, logger } from '../../services/log.service.js';
import { remapCharacters } from '../../utils/string.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class TextSmallTextCommand {
  static match: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
  static caps: string[] = 'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'.split('');

  @Slash('text-smallcaps', { description: 'Makes your text into small caps.' })
  async execute(
    @SlashOption('text', { description: 'The text you want to be small caps.' })
    text: string,
    interaction: CommandInteraction
  ) {
    await interaction
      .reply(`Here you go!\n${remapCharacters(text, TextSmallTextCommand.match, TextSmallTextCommand.caps)}`)
      .catch(InteractionFailedHandler);
  }
}
