/**
 * @file      appoint.command.ts
 * @brief     Appoints a member to a role, only one member can hold this role at a time.
 *
 * @author    Evan Elias Young
 * @date      2022-03-13
 * @date      2022-03-13
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import {
  CommandInteraction,
  GuildMember,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Role,
} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {
  logger,
  InteractionFailedHandlerGenerator,
} from '../../services/log.service.js';
import {isValidRolePosition} from '../react/role.command.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export default abstract class RoleAppointCommand {
  @Slash('role-appoint', {
    description:
      'Appoints a member to a role, only one member can hold this role at a time.',
  })
  async execute(
    @SlashOption('user', {
      description: 'User to appoint a position or role.',
      type: 'USER',
    })
    user: GuildMember,
    @SlashOption('role', {
      description: 'Role to appoint the user to.',
      type: 'ROLE',
    })
    role: Role,
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId)
      return await interaction
        .reply({
          ephemeral: true,
          content: 'Hey! `/role-appoint` can only be used in a server.',
        })
        .catch(InteractionFailedHandler);

    if (role.members.has(user.id))
      return await interaction
        .reply({
          ephemeral: true,
          content: `${user} already has that role! I'm done here.`,
        })
        .catch(InteractionFailedHandler);

    if (role.members.size > 1)
      return await interaction
        .reply({
          ephemeral: true,
          content: `${role} has more than one user... I don't know what to do!`,
        })
        .catch(InteractionFailedHandler);

    const isValidPosition = isValidRolePosition(interaction, role);

    if (!isValidPosition) {
      const embed = new MessageEmbed({
        title: 'Appoint Role',
        description: `The role <@&${role.id}> is above me in the role list so I can't hand it out.\nPlease make sure I have a role that is above it.`,
      });

      const button = new MessageActionRow({
        components: [
          new MessageButton({
            label: 'Discord Roles',
            url: 'https://support.discord.com/hc/en-us/articles/214836687-Role-Management-101',
            style: 'LINK',
          }),
        ],
      });

      return await interaction
        .reply({
          ephemeral: true,
          embeds: [embed],
          components: [button],
        })
        .catch(InteractionFailedHandler);
    }

    try {
      await Promise.all(
        role.members.map(async (member: GuildMember) =>
          member.roles.remove(role)
        )
      );
    } catch (e) {
      log.error('failed to remove previous appointees.', e);
      return await interaction
        .reply({
          ephemeral: true,
          content: `I couldn't remove ${role} from the previous appointee... I don't know what to do!`,
        })
        .catch(InteractionFailedHandler);
    }

    try {
      await user.roles.add(role);
      await interaction
        .reply({
          ephemeral: true,
          content: `Hey! I appointed ${user} to ${role}.`,
        })
        .catch(InteractionFailedHandler);
    } catch (e) {
      log.error('failed to remove appoint new user appointees.', e);
      return await interaction
        .reply({
          ephemeral: true,
          content: `I couldn't appoint ${user} to ${role}... I don't know what to do!`,
        })
        .catch(InteractionFailedHandler);
    }
  }
}
