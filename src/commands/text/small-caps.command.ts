/**
 * @file      small-caps.command.ts
 * @brief     Makes your text into small caps.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {
  InteractionFailedHandlerGenerator,
  logger,
} from '../../services/log.service.js';
import {remapCharacters} from '../../utils/native/string.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class TextSmallTextCommand {
  static match: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
  static caps: string[] = 'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'.split('');

  @Slash('text-smallcaps', {description: 'Makes your text into small caps.'})
  async execute(
    @SlashOption('text', {description: 'The text you want to be small caps.'})
    text: string,
    interaction: CommandInteraction
  ) {
    await interaction
      .reply(
        `Here you go!\n${remapCharacters(
          text,
          TextSmallTextCommand.match,
          TextSmallTextCommand.caps
        )}`
      )
      .catch(InteractionFailedHandler);
  }
}
