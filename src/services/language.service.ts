/**
 * @file      language.service.ts
 * @brief     Language service.
 */

import {Singleton} from '../models/singleton.model.js';
import {random} from '../utils/native/random.js';

@Singleton
export default class LanguageService {
  readonly WAIT_REPLIES = [
    "I'll think about it...",
    'Procrastinating...',
    'Putting it off...',
  ] as const;

  get wait() {
    return random.pick(this.WAIT_REPLIES);
  }
}
