/**
 * @file      corrupt.command.ts
 * @brief     Corrupts your text (Zalgo text).
 */

import {
  Client,
  CommandInteraction,
  MessageActionRow,
  MessageEmbed,
  SelectMenuInteraction,
} from 'discord.js';
import {Discord, SelectMenuComponent, Slash} from 'discordx';
import {COLOR} from '../models/color.enum.js';
import {ECommandCategory} from '../models/command-category.model.js';
import EmbedService from '../services/embed.service.js';
import HelpService from '../services/help.service.js';
import {
  logger,
  MessageWithErrorHandlerGenerator,
} from '../services/log.service.js';
import {isCommandCategory} from '../utils/type-assertion.js';
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);

@Discord()
export abstract class HelpCommand {
  #embedService = new EmbedService();
  #helpService = new HelpService();

  @SelectMenuComponent('select-help')
  async handleSelect(interaction: SelectMenuInteraction, _client: Client) {
    const rawType = interaction.values[0].split('_')[1];
    let type: ECommandCategory = ECommandCategory.general;
    if (isCommandCategory(rawType)) type = rawType;
    else log.debug('Unknown command type', {rawType});

    const embed = this.#embedService.helpEmbed(
      type,
      this.#helpService.categories.get(type)!
    );

    await interaction
      .update({embeds: [embed]})
      .catch(
        MessageWithErrorHandler(
          `Error sending help embed for interaction. [${interaction.guildId}]`
        )
      );
  }

  @Slash('help', {description: 'This command!'})
  async execute(interaction: CommandInteraction) {
    const {user} = interaction.client;
    if (!user) return;

    const selectMenu = new MessageActionRow({
      components: [this.#helpService.selectMenu],
    });

    const embed = new MessageEmbed({
      title: 'Command Help',
      description:
        "Hey! I got a new look with Discord's awesome slash-commands! \n\n\nThanks for using me!",
      author: {
        name: user.username,
        icon_url: user.avatarURL() ?? '',
      },
      thumbnail: {
        url: user.avatarURL() ?? '',
      },
      footer: {text: `Replying to: ${interaction.member?.user.username}`},
      timestamp: new Date(),
      color: COLOR.BRLL,
    });

    await interaction
      .reply({
        ephemeral: true,
        embeds: [embed],
        components: [selectMenu],
      })
      .catch(e => {
        log.error(
          `Failed to defer interaction. Interaction timestamp: ${new Date(
            interaction.createdTimestamp
          )}`
        );
        log.error(`${e}`);
      });
  }
}
