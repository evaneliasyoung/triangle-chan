/**
 * @file      message.events.ts
 * @brief     Handles message events.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-10
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { ClientEvents, Client } from 'discord.js';
import { Discord, On } from 'discordx';
import { ReactionHandler } from '../services/reaction.service.js';

@Discord()
abstract class MessageEvents {
  #reactionService = new ReactionHandler();

  @On('messageReactionAdd')
  async onReactionAdd([reaction, user]: ClientEvents['messageReactionAdd'], _client: Client, _guard: any) {
    return await this.#reactionService.handleReaction(reaction, user, 'add');
  }

  @On('messageReactionRemove')
  async onReactionRemove([reaction, user]: ClientEvents['messageReactionRemove'], _client: Client, _guard: any) {
    return await this.#reactionService.handleReaction(reaction, user, 'remove');
  }
}
