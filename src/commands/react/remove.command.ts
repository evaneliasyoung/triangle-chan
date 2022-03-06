/**
 * @file      reamove.command.ts
 * @brief     Remove an existing reaction role from a drop down menu.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { DELETE_REACT_ROLE_BY_ROLE_ID, GET_REACT_ROLE_BY_ROLE_ID } from '../../database/database.js';
import { ReactMessageUpdate as EReactMessageUpdate, updateReactMessages } from '../../utils/reactions.js';
import { logger } from '../../services/log.service.js';
const log = logger(import.meta);

@Discord()
export abstract class ReactRemoveCommand {
  @Slash('react-reamove', { description: 'Remove an existing reaction role from a drop down menu.' })
  async execute(
    interaction: CommandInteraction
  ) {
    const role = interaction.options.get('role')?.role;

    if (!role) {
      log.error(
        `Interaction was missing role property despite it being required.`
      );

      return interaction
        .reply({
          ephemeral: true,
          content: `Hey! For some reason I was unable to get the role that you told me to delete. Is it already deleted? Please try again. :)`,
        })
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    const reactRole = await GET_REACT_ROLE_BY_ROLE_ID(role.id);

    if (!reactRole) {
      log.debug(
        `User passed in role[${role.id}] that isn't in guilds reactRoles list.`
      );

      return interaction
        .reply({
          ephemeral: true,
          content: `Hey! That role isn't in my system, perhaps you meant to pass in a different role?`,
        })
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }

    try {
      await DELETE_REACT_ROLE_BY_ROLE_ID(role.id);

      log.debug(`Successfully removed guilds[${interaction.guildId}] react role[${role.id}]`);

      const emojiMention = reactRole?.emojiTag ?? reactRole?.emojiId;

      await interaction
        .reply({
          ephemeral: true,
          content: `I successfully removed the react role (${emojiMention} - <@&${role.id}>)! You can add it back at any time if you wish.\n\nI'm gonna do some cleanup now and update any react role embed...`,
        })
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });

      if (reactRole.categoryId) {
        updateReactMessages(
          interaction.client,
          reactRole.categoryId,
          log,
          EReactMessageUpdate.reactRoleRemove
        );
      }
    } catch (e) {
      log.error(
        `Error'd when trying to delete react role[${role.id}] on guild[${interaction.guildId}]`
      );
      log.error(`${e}`);

      interaction
        .reply({
          ephemeral: true,
          content: `Hey! I had an issue deleting that react role. Please wait a moment and try again.`,
        })
        .catch((e) => {
          log.error(`Interaction failed.`);
          log.error(`${e}`);
        });
    }
  };
}
