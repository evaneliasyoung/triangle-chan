/**
 * @file      embed.service.ts
 * @brief     Embed service.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-09
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { CommandInteraction, Guild, GuildMember, MessageEmbed, User } from 'discord.js';
import { GET_REACT_ROLES_BY_CATEGORY_ID } from '../database/database.js';
import { Category, ReactRole } from '../database/entities/index.js';
import { COLOR } from '../models/color.enum.js';
import { Singleton } from '../models/singleton.model.js';
import { dateToStringAndDuration, expandDateToUTC } from '../utils/luxon.js';
import { toTitleCase } from '../utils/string.js';

@Singleton
export default class EmbedService {
  categoryReactRoleEmbed = async (category: Category) => {
    const categoryRoles = await GET_REACT_ROLES_BY_CATEGORY_ID(category.id);
    const reactRoles = categoryRoles.length ? this.reactRolesFormattedString(categoryRoles) : `This category has no react roles! Add some react roles to this category by using \`/category-add\`!`;
    const desc = category.description === '' || !category.description ? 'Description not set. Set it in `/category-edit`' : category.description;

    return new MessageEmbed({
      title: category.name,
      description: `Mutually exclusive: **${category.mutuallyExclusive}**\n\nDesc: **${desc}**\n\n${reactRoles}`,
      color: COLOR.DEFAULT
    });
  };

  reactRolesFormattedString = (reactRoles: ReactRole[]) => reactRoles.map(r =>
    `${r.emojiTag ?? r.emojiId} - <@&${r.roleId}>`).join('\n');

  reactRoleListEmbed = (reactRoles: ReactRole[]) => {
    const rolesNotInCategory = reactRoles.filter(r => !r.categoryId);
    const rolesInCategory = reactRoles.filter(r => r.categoryId);
    const inCategory = rolesInCategory.length ? `**In a category:**\n${this.reactRolesFormattedString(rolesInCategory)}\n` : '';
    const notInCategory = rolesNotInCategory.length ? `**Not in a category:**\n${this.reactRolesFormattedString(rolesNotInCategory)}` : '';

    return new MessageEmbed({
      title: 'All your reaction roles!',
      description: `This doesn't show what categories these roles are in.\nCheck out \`/category-list\` for more in-depth listing.\n\n${inCategory}${notInCategory}`,
      color: COLOR.DEFAULT
    });
  };

  freeReactRoles = async (reactRoles: ReactRole[]) => {
    return new MessageEmbed({
      title: 'React roles not in a category',
      description: `These roles are up for grabs!\nCheck out \`/category-add\` if you want to add these to a category.\n\n${this.reactRolesFormattedString(reactRoles)}`,
      color: COLOR.YELLOW
    });
  };

  reactRoleEmbed = (reactRoles: ReactRole[], category: Category) => {
    const reactRolesString = this.reactRolesFormattedString(reactRoles);
    return new MessageEmbed({
      title: category.name,
      description: `${category.description}\n\n${reactRolesString}`,
      color: COLOR.DEFAULT
    });
  };

  aboutServerEmbed = async (guild: Guild) => {
    const {
      id, memberCount, channels, roles, preferredLocale,
      createdAt, verificationLevel, explicitContentFilter,
      emojis, name
    } = guild;
    const numEmojis = emojis.cache.size;
    const emojiList = Array(Math.min(30, numEmojis)).fill(0).map((_e, i) => emojis.cache.at(i)!.toString());
    const emojiString = `${emojiList.join('')}${numEmojis > 30 ? '...' : ''} **(${numEmojis})**`;
    const created = expandDateToUTC(createdAt);

    return new MessageEmbed({
      title: name,
      thumbnail: { url: guild.iconURL()! },
      description: 'Server Statistics',
      fields: [
        { name: 'Owner', value: (await guild.fetchOwner())?.displayName ?? '[REDACTED]', inline: true },
        { name: 'ID', value: id, inline: true },
        { name: 'Member Count', value: memberCount.toString(), inline: true },
        { name: 'Channel Count', value: channels.valueOf().size.toString(), inline: true },
        { name: 'Role Count', value: roles.valueOf().size.toString(), inline: true },
        { name: 'Locale', value: preferredLocale, inline: true },
        { name: 'Explicit Content Filter', value: toTitleCase(explicitContentFilter.replace('_', ' ')), inline: true },
        { name: 'Verification Level', value: toTitleCase(verificationLevel.replace('_', ' ')), inline: true },
        { name: 'Creation Time', value: dateToStringAndDuration(created), inline: false },
        { name: 'Emoji Count', value: emojiString, inline: false }
      ],
      color: COLOR.DEFAULT
    });
  };
}
