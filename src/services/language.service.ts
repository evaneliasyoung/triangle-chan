/**
 * @file      language.service.ts
 * @brief     Language service.
 *
 * @author    Evan Elias Young
 * @date      2022-03-08
 * @date      2022-03-10
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { Singleton } from '../models/singleton.model.js';
import { Random } from '../utils/random.js';

@Singleton
export default class LanguageService {
  WAIT_REPLIES = ["I'll think about it...", "Procrastinating...", "Putting it off..."] as const;

  get wait() { return Random.pick(this.WAIT_REPLIES); }
}
