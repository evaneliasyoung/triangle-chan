/**
 * @file      message.events.ts
 * @brief     Handles message events.
 */

import {ClientEvents, Client} from 'discord.js';
import {Discord, On} from 'discordx';
import {SafeAny} from '../models/object.types.js';
import ReactionHandler from '../services/reaction.service.js';

@Discord()
export default abstract class MessageEvents {
  #reactionService = new ReactionHandler();

  @On('messageReactionAdd')
  async onReactionAdd(
    [reaction, user]: ClientEvents['messageReactionAdd'],
    _client: Client,
    _guard: SafeAny
  ) {
    return await this.#reactionService.handleReaction(reaction, user, 'add');
  }

  @On('messageReactionRemove')
  async onReactionRemove(
    [reaction, user]: ClientEvents['messageReactionRemove'],
    _client: Client,
    _guard: SafeAny
  ) {
    return await this.#reactionService.handleReaction(reaction, user, 'remove');
  }
}
