/**
 * @file      nuke.command.ts
 * @brief     This will remove ALL react roles for this server.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { DELETE_ALL_REACT_ROLES_BY_GUILD_ID } from '../../database/database.js';
import { logger } from '../../services/log.service.js';
const log = logger(import.meta);

@Discord()
export abstract class ReactNukeCommand {
  handleButton = async (interaction: ButtonInteraction, args: string[]) => {
    if (!interaction.guildId) return await interaction.followUp(`Hey! For some reason Discord didn't send me your guild info. No longer nuking.`);

    await interaction
      .followUp(`Okay well, you, ${interaction.member?.user || '[REDACTED]'} asked for all react-roles to be deleted.`)
      .catch((e) => {
        log.error(`Interaction failed`);
        log.error(`${e}`);
      });

    DELETE_ALL_REACT_ROLES_BY_GUILD_ID(interaction.guildId)
      .then(async () => {
        log.debug(`User[${interaction.user.id}] removed ALL reactroles for guild[${interaction.guildId}]`);
        await interaction
          .followUp(`Hey! I deleted all your react roles. Any categories you had should still stand.`)
          .catch(() => log.error(`Failed to send interaction follwup`));
      })
      .catch(async (e) => {
        log.error(`Failed to delete reactroles for guild[${interaction.guildId}]`);
        log.error(`${e}`);

        await interaction
          .followUp(`Hey! I had an issue deleting all the react roles.`)
          .catch(() => log.error(`Failed to send interaction follwup`));
      });
  };

  @Slash('react-nuke', { description: 'This will remove ALL react roles for this server.' })
  async execute(
    interaction: CommandInteraction
  ) {
    const buttons = new MessageActionRow({
      components: [new MessageButton({
        customId: 'react-nuke_confirm',
        label: 'Confirm Nuke',
        style: 'DANGER'
      })]
    });

    await interaction.reply({
      ephemeral: true,
      components: [buttons],
      content: `ARE YOU SURE YOU WANT TO DELETE ALL YOUR REACT ROLES?`,
    });
  };
}
