/**
 * @file      embed.service.ts
 * @brief     Embed service.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { Guild, GuildBasedChannel, GuildMember, MessageEmbed, ThreadChannelTypes, Client } from 'discord.js';
import { DApplicationCommand } from 'discordx';
import { DateTime } from 'luxon';
import { Counter, GET_REACT_ROLES_BY_CATEGORY_ID } from '../database/database.js';
import { Category, ReactRole } from '../database/database.js';
import { BotInfo } from '../info.js';
import { COLOR } from '../models/color.enum.js';
import { ECommandCategory } from '../models/command-category.model.js';
import { Singleton } from '../models/singleton.model.js';
import { dateToISO, dateToStringAndDuration, expandDateToUTC } from '../utils/luxon.js';
import { toTitleCase } from '../utils/string.js';

@Singleton
export default class EmbedService {
  #getChannelTypeString = (type: 'GUILD_CATEGORY' | 'GUILD_NEWS' | 'GUILD_STAGE_VOICE' | 'GUILD_STORE' | 'GUILD_TEXT' | ThreadChannelTypes | 'GUILD_VOICE') => {
    switch (type) {
      case 'GUILD_CATEGORY':
        return 'Category';
      case 'GUILD_NEWS':
        return 'News';
      case 'GUILD_NEWS_THREAD':
        return 'News Thread';
      case 'GUILD_PRIVATE_THREAD':
        return 'Private Thread';
      case 'GUILD_PUBLIC_THREAD':
        return 'Public Thread';
      case 'GUILD_STAGE_VOICE':
        return 'Stage Voice';
      case 'GUILD_STORE':
        return 'Store';
      case 'GUILD_TEXT':
        return 'Text';
      case 'GUILD_VOICE':
        return 'Voice';
      default:
        return '[UNKNOWN]';
    }
  };

  helpEmbed = (category: ECommandCategory, commands: DApplicationCommand[]) =>
    new MessageEmbed({
      title: `**${category.toUpperCase()} commands**`,
      fields: commands.map(({ name, description }) => ({
        name: `/${name}`,
        value: description
      })),
      color: COLOR.DEVL
    });

  categoryReactRoleEmbed = async (category: Category) => {
    const categoryRoles = await GET_REACT_ROLES_BY_CATEGORY_ID(category.id);
    const reactRoles = categoryRoles.length ? this.reactRolesFormattedString(categoryRoles) : `This category has no react roles! Add some react roles to this category by using \`/category-add\`!`;
    const desc = category.description === '' || !category.description ? 'Description not set. Set it in `/category-edit`' : category.description;

    return new MessageEmbed({
      title: category.name,
      description: `Mutually exclusive: **${category.mutuallyExclusive}**\n\nDesc: **${desc}**\n\n${reactRoles}`,
      color: COLOR.BRLL
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
      color: COLOR.BRLL
    });
  };

  freeReactRoles = async (reactRoles: ReactRole[]) => {
    return new MessageEmbed({
      title: 'React roles not in a category',
      description: `These roles are up for grabs!\nCheck out \`/category-add\` if you want to add these to a category.\n\n${this.reactRolesFormattedString(reactRoles)}`,
      color: COLOR.HPSQ
    });
  };

  reactRoleEmbed = (reactRoles: ReactRole[], category: Category) => {
    const reactRolesString = this.reactRolesFormattedString(reactRoles);
    return new MessageEmbed({
      title: category.name,
      description: `${category.description}\n\n${reactRolesString}`,
      color: COLOR.BRLL
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
      color: COLOR.BRLL
    });
  };

  aboutChannelEmbed = (channel: GuildBasedChannel) => {
    const { id, createdAt, type, name } = channel;
    const topic: string = channel.isText() && !channel.isThread() ? channel.topic ?? 'None' : 'None';
    const created: DateTime = expandDateToUTC(createdAt);

    return new MessageEmbed({
      title: name,
      description: 'Channel Statistics',
      fields: [
        { name: 'ID', value: id, inline: true },
        { name: 'Type', value: this.#getChannelTypeString(type), inline: true },
        { name: 'Topic', value: topic, inline: true },
        { name: 'Creation Type', value: dateToStringAndDuration(created), inline: true }
      ],
      color: COLOR.BRLL
    });
  };

  aboutMemberEmbed = (member: GuildMember) => {
    const { joinedAt, user } = member!;
    const { username, discriminator, id, createdAt } = user;

    const icon: string = user.avatarURL() ?? user.defaultAvatarURL;
    const created: DateTime = expandDateToUTC(createdAt);
    const joined: DateTime = expandDateToUTC(joinedAt ?? new Date());

    return new MessageEmbed({
      title: `Member Information`,
      thumbnail: { url: icon },
      description: `${username}#${discriminator}`,
      fields: [
        { name: 'ID', value: id, inline: false },
        { name: 'Account Creation Time', value: dateToStringAndDuration(created), inline: false },
        { name: 'Joined Server At', value: dateToStringAndDuration(joined), inline: false },
      ],
      color: COLOR.BRLL
    });
  };

  aboutBotEmbed = (client: Client) => new MessageEmbed({
    description: BotInfo.tagline,
    fields: [
      { name: 'Author', value: 'MoM Chapter', inline: true },
      { name: 'Library', value: BotInfo.library, inline: true },
      { name: 'Version', value: BotInfo.version, inline: true },
      { name: 'Date', value: dateToISO(BotInfo.date), inline: true },
      { name: 'Servers', value: client.guilds.cache.size.toString(), inline: true },
      { name: 'Channels', value: client.channels.cache.size.toString(), inline: true },
      { name: 'Users', value: client.users.cache.size.toString(), inline: true },
    ],
    thumbnail: {
      url: client.user!.avatarURL()?.toString() ?? client.user!.defaultAvatarURL ?? undefined
    },
    color: COLOR.BRLL
  });

  counterEmbed = async (client: Client, counter: Counter) => {
    const { guildId, name, type, roleId, emojiId } = counter;
    let description = `Emoji: ${emojiId}\nType: **${['Total', 'Online', 'Boost', 'Role'][type - 1]}**`;
    if (roleId) {
      const guild = await client.guilds.fetch(guildId);
      const { roles } = guild;
      const role = await roles.fetch(roleId);
      if (role) description += `\nRole: ${role}`;
    }
    return new MessageEmbed({
      title: `${name} Counter`,
      description,
      color: COLOR.BRLL
    });
  };

}
