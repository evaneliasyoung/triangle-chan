/**
 * @file      create.command.ts
 * @brief     Create a new counter to count members in the name of a voice channel.
 *
 * @author    Evan Elias Young
 * @date      2022-03-10
 * @date      2022-03-13
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import {AnyChannel, CommandInteraction, Guild, Role} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import emojiRegex from 'emoji-regex';
import {
  CREATE_COUNTER,
  ECounterType,
} from '../../database/entities/counter.entity.js';
import {
  isVoiceChannel,
  asCounterType,
  isCounterType,
} from '../../utils/type-assertion.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
  MessageWithErrorHandlerGenerator,
} from '../../services/log.service.js';
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class CounterCreateCommand {
  @Slash('counter-create', {
    description:
      'Create a new counter to count members in the name of a voice channel.',
  })
  async execute(
    @SlashOption('name', {
      description: 'The name of the counter.',
      type: 'STRING',
    })
    name: string,
    @SlashOption('emoji', {
      description: 'The emoji you want to use.',
      type: 'STRING',
    })
    emoji: string,
    @SlashOption('channel', {
      description: 'The voice channel to update.',
      type: 'CHANNEL',
    })
    channel: Extract<AnyChannel, {guild: Guild}>,
    @SlashOption('type', {
      description:
        'The type of filter to use when counting members. [`total`, `online`, `boost`, `role`]',
      type: 'STRING',
    })
    type: string,
    @SlashOption('role', {
      description: `The role to count, if \`type\` is set to \`role\`.`,
      type: 'ROLE',
      required: false,
    })
    role: Role | null | undefined,
    interaction: CommandInteraction
  ) {
    if (!interaction.guildId)
      return log.error(`GuildID did not exist on interaction.`);

    if (!isVoiceChannel(channel))
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! It says you used text-based channel! You need to use a voice-based channel. Please try again.`,
        })
        .catch(InteractionFailedHandler);

    if (name.length > 18)
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! I only allow 18 characters max for counter names. Try making the counter name simple!`,
        })
        .catch(InteractionFailedHandler);

    if (!isCounterType(type))
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! I don't understand what type you meant by ${type}. I only use \`total\`, \`online\`, \`boost\`, and \`role\`.`,
        })
        .catch(InteractionFailedHandler);

    const unicodeEmoji = emoji.match(emojiRegex());
    if (!unicodeEmoji)
      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! You didn't pass in a proper emoji. You need to pass in a Discord emoji.`,
        })
        .catch(
          MessageWithErrorHandler(`Failed to alert user of invalid emojis.`)
        );

    const emojiId = unicodeEmoji[0];
    if (!emojiId || emojiId === '') {
      log.error(`Failed to extract emoji[${emoji}] with regex from string.`);

      return await interaction
        .reply({
          ephemeral: true,
          content: `Hey! I had an issue trying to use that emoji. Please wait a moment and try again.`,
        })
        .catch(InteractionFailedHandler);
    }

    const counterType = asCounterType(type);
    if (counterType === ECounterType.role) {
      if (!role)
        return await interaction
          .reply({
            ephemeral: true,
            content: `I'm having trouble finding the role that you are talking about.`,
          })
          .catch(InteractionFailedHandler);
    }
    await CREATE_COUNTER(
      name,
      emojiId,
      interaction.guildId,
      channel.id,
      counterType,
      role?.id
    );
    await interaction
      .reply(`Hey! I successfully created the counter \`${name}\` for you!`)
      .catch(InteractionFailedHandler);
  }
}
