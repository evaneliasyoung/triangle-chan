/**
 * @file      message.events.ts
 * @brief     Handles message events.
 */

import {ClientEvents, Client} from 'discord.js';
import {ArgsOf, Discord, GuardFunction, On} from 'discordx';
import ReactionHandler from '../services/reaction.service.js';

@Discord()
export default abstract class MessageEvents {
  #reactionService = new ReactionHandler();

  @On('messageReactionAdd')
  async onReactionAdd(
    [reaction, user]: ClientEvents['messageReactionAdd'],
    _client: Client,
    _guard: GuardFunction<ArgsOf<'messageReactionAdd'>>
  ) {
    return await this.#reactionService.handleReaction(reaction, user, 'add');
  }

  @On('messageReactionRemove')
  async onReactionRemove(
    [reaction, user]: ClientEvents['messageReactionRemove'],
    _client: Client,
    _guard: GuardFunction<ArgsOf<'messageReactionRemove'>>
  ) {
    return await this.#reactionService.handleReaction(reaction, user, 'remove');
  }
}
