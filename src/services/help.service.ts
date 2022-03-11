/**
 * @file      help.service.ts
 * @brief     Help service.
 *
 * @author    Evan Elias Young
 * @date      2022-03-11
 * @date      2022-03-11
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import { DApplicationCommand, MetadataStorage } from 'discordx';
import { TCommandCategory, isCommandCategory, ECommandCategory } from '../models/command-category.model.js';
import { Singleton } from '../models/singleton.model.js';

@Singleton
export default class HelpService {
  #getCommandCategory({ name }: DApplicationCommand): TCommandCategory {
    let commandCategory = name.substring(0, name.indexOf('-'));
    if (isCommandCategory(commandCategory)) return commandCategory;
    return 'general';
  }

  get metadata() { return MetadataStorage.instance; }
  get commands() { return this.metadata.applicationCommandSlashes; }
  get categories() {
    let categories = new Map<TCommandCategory, DApplicationCommand[]>(
      (Object.keys(ECommandCategory) as TCommandCategory[]).map(category => [category, []])
    );
    this.commands.forEach(command => {
      categories
        .get(this.#getCommandCategory(command))!
        .push(command);
    });
    return categories;
  }
}
