/**
 * @file      edit.command.ts
 * @brief     Edit any counter's name, emoji, or purpose.
 */

import {CommandInteraction, Role} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {
  EDIT_COUNTER_BY_ID,
  GET_COUNTER_BY_NAME,
} from '../../database/database.js';
import {
  ECounterType,
  ICounter,
} from '../../database/entities/counter.entity.js';
import {asCounterType, isCounterType} from '../../utils/type-assertion.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
  MessageWithErrorHandlerGenerator,
} from '../../services/log.service.js';
import emojiRegex from 'emoji-regex';
import PermissionService from '../../services/permission.service.js';
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class CounterEditCommand {
  #permissionService = new PermissionService();

  @Slash('counter-edit', {
    description: `Edit any counter's name, emoji, or purpose.`,
  })
  async execute(
    @SlashOption('name', {
      description:
        'The name of the counter, this is case sensitive and used to find your counter.',
      type: 'STRING',
    })
    name: string,
    @SlashOption('new-name', {
      description:
        'Change the name of the counter. This is the display text of the counter.',
      type: 'STRING',
      required: false,
    })
    newName: string | null,
    @SlashOption('new-emoji', {
      description:
        'Change the emoji. This is shown before your names in the counter.',
      type: 'STRING',
      required: false,
    })
    newEmoji: string | null,
    @SlashOption('new-type', {
      description:
        'Change the counter type. [`total`, `online`, `boost`, `role`]',
      type: 'STRING',
      required: false,
    })
    newType: string | null,
    @SlashOption('new-role', {
      description: `Change the counter's role. Only used if \`type\` or \`new-type\` is set to \`role\`.`,
      type: 'ROLE',
      required: false,
    })
    newRole: Role | null,
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId)
      return await interaction.reply({
        ephemeral: true,
        content: 'Hey! `/counter-edit` can only be used in a server.',
      });

    if (!this.#permissionService.canManageChannels(interaction.member))
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! You don't have permission to use \`/counter-create\`.`,
        })
        .catch(InteractionFailedHandler);

    if (!newName && !newEmoji && !newType) {
      log.debug(`User didn't change anything about the counter`);
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! You need to pass at _least_ one updated field about the counter.`,
        })
        .catch(InteractionFailedHandler);
    }

    if (!name) {
      log.error(`Required option name was undefined.`);
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! I had an issue finding the counter. Please wait a second and try again.`,
        })
        .catch(InteractionFailedHandler);
    }

    const counter = await GET_COUNTER_BY_NAME(interaction.guildId, name);
    if (!counter) {
      log.debug(
        `Counter not found with name[${name}] in guild[${interaction.guildId}]`
      );

      return await interaction
        .reply(
          `Hey! I couldn't find a counter with that name. The name is _case sensitive_ so make sure it's typed correctly.`
        )
        .catch(InteractionFailedHandler);
    }

    let type = counter.type;
    if (newType && !isCounterType(newType))
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! I don't understand what type you meant by ${newType}. I only use \`total\`, \`online\`, \`boost\`, and \`role\`.`,
        })
        .catch(InteractionFailedHandler);
    if (newType) type = asCounterType(newType);

    let emojiId = counter.emojiId;
    if (newEmoji) {
      const unicodeEmoji = newEmoji.match(emojiRegex());
      if (!unicodeEmoji)
        return await interaction
          .reply({
            ephemeral: true,
            content: `Hey! You didn't pass in a proper emoji. You need to pass in a Discord emoji.`,
          })
          .catch(
            MessageWithErrorHandler(`Failed to alert user of invalid emojis.`)
          );

      if (!unicodeEmoji[0] || unicodeEmoji[0] === '') {
        log.error(
          `Failed to extract emoji[${newEmoji}] with regex from string.`
        );

        return await interaction
          .reply({
            ephemeral: true,
            content: `Hey! I had an issue trying to use that emoji. Please wait a moment and try again.`,
          })
          .catch(InteractionFailedHandler);
      }
      emojiId = unicodeEmoji[0];
    }

    let roleId = counter.roleId;
    if (type === ECounterType.role) {
      if (newRole) {
        roleId = newRole.id;
      } else if (!roleId)
        return await interaction.reply({
          ephemeral: true,
          content: `I'm having trouble making a role counter without a role!`,
        });
    } else {
      if (counter.roleId) counter.roleId = undefined;
      if (newRole)
        return await interaction.reply({
          ephemeral: true,
          content: `I'm having trouble figuring out why you gave me a role.`,
        });
    }

    const updatedCounter: Partial<ICounter> = {
      name: newName ?? name,
      emojiId,
      type,
      roleId,
    };

    EDIT_COUNTER_BY_ID(counter.id, updatedCounter)
      .then(async () => {
        log.info(
          `Updated counter[${counter.id}] in guild[${interaction.guildId}] successfully.`
        );

        await interaction
          .reply({
            ephemeral: true,
            content: `Hey! I successfully updated the counter \`${counter.name}\` for you.`,
          })
          .catch(InteractionFailedHandler);
      })
      .catch(InteractionFailedHandler);
  }
}
