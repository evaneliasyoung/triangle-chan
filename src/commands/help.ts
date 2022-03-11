/**
 * @file      corrupt.command.ts
 * @brief     Corrupts your text (Zalgo text).
 *
 * @author    Evan Elias Young
 * @date      2022-03-11
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { Client, CommandInteraction, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';
import { Discord, SelectMenuComponent, Slash } from 'discordx';
import { COLOR } from '../models/color.enum.js';
import { ECommandCategory, isCommandCategory } from '../models/command-category.model.js';
import EmbedService from '../services/embed.service.js';
import HelpService from '../services/help.service.js';
import { logger, MessageWithErrorHandlerGenerator } from '../services/log.service.js';
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);

@Discord()
export abstract class TextCorruptCommand {
  #embedService = new EmbedService();
  #helpService = new HelpService();

  @SelectMenuComponent('select-help')
  async handleSelect(interaction: SelectMenuInteraction, _client: Client) {
    const rawType = interaction.values[0].split('_')[1];
    let type: ECommandCategory = ECommandCategory.general;
    if (isCommandCategory(rawType)) type = rawType;
    else log.debug(`Unknown command type`, { rawType });

    console.log(this.#helpService.categories);

    const embed = this.#embedService.helpEmbed(type, this.#helpService.categories.get(type)!);

    await interaction
      .update({ embeds: [embed] })
      .catch(MessageWithErrorHandler(`Error sending help embed for interaction. [${interaction.guildId}]`));
  };

  @Slash('help', { description: 'This command!' })
  async execute(interaction: CommandInteraction) {
    const embed = new MessageEmbed();

    const { user } = interaction.client;
    if (!user) return;

    const selectMenu = new MessageActionRow({
      components: [new MessageSelectMenu({
        custom_id: 'select-help',
        placeholder: 'Pick a category',
        options: [
          {
            label: 'About commands',
            description: 'Learn more about a user, channel, member, or me!',
            value: `help_${ECommandCategory.about}`,
          },
          {
            label: 'Category commands',
            description: 'Want to categorize your reaction roles? Sort them with categories!',
            value: `help_${ECommandCategory.category}`,
          },
          {
            label: 'Counter commands',
            description: 'Want to count members by status or role? Setup voice-channels with counters!',
            value: `help_${ECommandCategory.counter}`,
          },
          {
            label: 'Reaction role commands',
            description: `Manage your servers reaction roles with these commands.`,
            value: `help_${ECommandCategory.react}`,
          },
          {
            label: 'General commands',
            description: 'Basic commands everyone can use!',
            value: `help_${ECommandCategory.general}`,
          },
        ]
      })]
    });

    embed
      .setTitle('Command Help')
      .setColor(COLOR.BRLL)
      .setAuthor({
        name: user.username,
        iconURL: user.avatarURL() || ''
      })
      .setThumbnail(user.avatarURL() || '')
      .setFooter({
        text: `Replying to: ${interaction.member?.user.username}`,
      })
      .setTimestamp(new Date());

    embed.setDescription(`Hey! I got a new look with Discord's awesome slash-commands! \n\n\nThanks for using me!`);

    interaction
      .reply({
        ephemeral: true,
        embeds: [embed],
        components: [selectMenu],
      })
      .catch((e) => {
        log.error(
          `Failed to defer interaction. Interaction timestamp: ${new Date(
            interaction.createdTimestamp
          )}`
        );
        log.error(`${e}`);
      });
  };
}
