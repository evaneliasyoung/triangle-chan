/**
 * @file      help.service.ts
 * @brief     Help service.
 */

import {MessageSelectMenu} from 'discord.js';
import {DApplicationCommand, MetadataStorage} from 'discordx';
import {
  TCommandCategory,
  ECommandCategory,
} from '../models/command-category.model.js';
import {Singleton} from '../models/singleton.model.js';
import {toTitleCase} from '../utils/native/string.js';
import {isCommandCategory} from '../utils/type-assertion.js';

@Singleton
export default class HelpService {
  #getCommandCategory({name}: DApplicationCommand): TCommandCategory {
    const commandCategory = name.substring(0, name.indexOf('-'));
    if (isCommandCategory(commandCategory)) return commandCategory;
    return 'general';
  }
  #categoryDescriptions = {
    general: 'Basic commands everyone can use!',
    about: 'Learn more about a user, channel, member, or me!',
    category: 'Organize your reaction-roles into categories!',
    counter: 'Easily count members by status or role!',
    random: 'Let fate decide with a coin toss or 8ball. Spice things up!',
    reaction: 'Manage your reaction roles with these commands!',
    role: 'Other types of roles, appointed, and elected.',
    text: 'Format your text to get the right feeling accross!',
  };

  get metadata() {
    return MetadataStorage.instance;
  }
  get commands() {
    return this.metadata.applicationCommandSlashes;
  }
  get categories() {
    const categories = new Map<TCommandCategory, DApplicationCommand[]>(
      (Object.keys(ECommandCategory) as TCommandCategory[]).map(category => [
        category,
        [],
      ])
    );
    const addToCategory = (command: DApplicationCommand) =>
      categories.get(this.#getCommandCategory(command))!.push(command);
    this.commands.forEach(addToCategory.bind(this));
    return categories;
  }

  get selectMenu(): MessageSelectMenu {
    return new MessageSelectMenu({
      custom_id: 'select-help',
      placeholder: 'Pick a category',
      options: Object.entries(this.#categoryDescriptions).map(
        ([category, description]) => ({
          label: `${toTitleCase(category)} commands`,
          description,
          value: `help_${category}`,
        })
      ),
    });
  }
}
