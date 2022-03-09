/**
 * @file      bot.command.ts
 * @brief     The bots information.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-09
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { COLOR } from '../../models/color.enum.js';

@Discord()
export abstract class AboutBotCommand {
  @Slash('about-bot', { description: `The bot's information.` })
  async execute(interaction: CommandInteraction) {
    let embed = new MessageEmbed({
      title: 'I\'m Triangle Chan  :wave:',
      description: 'desc',
      fields: [
        { name: 'Author', value: 'Evan Elias Young', inline: true },
        { name: 'Library', value: 'discord.ts / Node', inline: true },
        { name: 'Version', value: '0.1.0', inline: true },
      ],
      color: COLOR.BRLL,
      thumbnail: {
        url: interaction.client.user?.avatarURL()?.toString() ?? interaction.client.user?.defaultAvatarURL ?? undefined
      }
    });

    interaction.reply({ embeds: [embed] });
  }
}
