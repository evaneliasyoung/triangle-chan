/**
 * @file      embed.service.ts
 * @brief     Embed service.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { MessageEmbed, User } from 'discord.js';
import { GET_REACT_ROLES_BY_CATEGORY_ID } from '../database/database.js';
import { Category, ReactRole } from '../database/entities/index.js';
import { COLOR } from '../models/color.enum.js';

export class EmbedService {
  constructor() { }

  static #userTagInfo = (user: User | string) =>
    `${typeof user === 'string' ? user : user?.tag} (<@${typeof user === 'string' ? user : user.id}>)`;

  static categoryReactRoleEmbed = async (category: Category) => {
    const categoryRoles = await GET_REACT_ROLES_BY_CATEGORY_ID(category.id);
    const reactRoles = categoryRoles.length ? this.reactRolesFormattedString(categoryRoles) : `This category has no react roles! Add some react roles to this category by using \`/category-add\`!`;
    const desc = category.description === '' || !category.description ? 'Description not set. Set it in `/category-edit`' : category.description;

    return new MessageEmbed({
      title: category.name,
      description: `Mutually exclusive: **${category.mutuallyExclusive}**\n\nDesc: **${desc}**\n\n${reactRoles}`,
      color: COLOR.DEFAULT
    });
  };

  static reactRolesFormattedString = (reactRoles: ReactRole[]) => reactRoles.map(r =>
    `${r.emojiTag ?? r.emojiId} - <@&${r.roleId}>`).join('\n');

  static reactRoleListEmbed = (reactRoles: ReactRole[]) => {
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

  static freeReactRoles = async (reactRoles: ReactRole[]) => {
    return new MessageEmbed({
      title: 'React roles not in a category',
      description: `These roles are up for grabs!\nCheck out \`/category-add\` if you want to add these to a category.\n\n${this.reactRolesFormattedString(reactRoles)}`,
      color: COLOR.YELLOW
    });
  };

  static reactRoleEmbed = (reactRoles: ReactRole[], category: Category) => {
    const reactRolesString = this.reactRolesFormattedString(reactRoles);
    return new MessageEmbed({
      title: category.name,
      description: `${category.description}\n\n${reactRolesString}`,
      color: COLOR.DEFAULT
    });
  };

  static tutorialEmbed = (pageId: number) => {
    return new MessageEmbed({
      title: 'title', description: 'description',
      color: COLOR.DEFAULT
    });
  };
}
