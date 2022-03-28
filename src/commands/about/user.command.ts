/**
 * @file      user.command.ts
 * @brief     Provides information about a user.
 */

import {CommandInteraction, GuildMember, User} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import EmbedService from '../../services/embed.service.js';
import {
  InteractionFailedHandlerGenerator,
  logger,
} from '../../services/log.service.js';
const log = logger(import.meta);
const InteractionFailedHandler = InteractionFailedHandlerGenerator(log);

@Discord()
export abstract class AboutUserCommand {
  #embedService = new EmbedService();

  @Slash('about-user', {
    description: 'Provides information about a user.',
  })
  async execute(
    @SlashOption('user', {
      description: 'The user to learn more about.',
      type: 'USER',
      required: false,
    })
    userOpt: User | GuildMember | null,
    interaction: CommandInteraction
  ) {
    log.debug('execute about-user', {user: userOpt, interaction});
    const {member, user} = interaction;
    const arg = userOpt ?? (member as GuildMember | null) ?? user;
    await interaction
      .reply({
        embeds: [this.#embedService.aboutUserEmbed(arg)],
      })
      .catch(InteractionFailedHandler);
  }
}
