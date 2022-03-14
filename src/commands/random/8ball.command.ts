/**
 * @file      8ball.command.ts
 * @brief     Ask the 8 Ball a question and see what it has to say.
 *
 * @author    Evan Elias Young
 * @date      2022-03-11
 * @date      2022-03-12
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import {CommandInteraction} from 'discord.js';
import {Discord, Slash, SlashOption} from 'discordx';
import {Random} from '../../utils/native/random.js';

@Discord()
abstract class Ball8Command {
  get next() {
    return Random.pick(
      'It is certain',
      'It is decidedly so',
      'Without a doubt',
      'Yes, definitely',
      'You may rely on it',
      'As I see it, yes',
      'Most likely',
      'Outlook good',
      'Yes',
      'Signs point to yes',
      'Reply hazy try again',
      'Ask again later',
      'Better not tell you now',
      'Cannot predict now',
      'Concentrate and ask again',
      `Don't count on it`,
      'My reply is no',
      'My sources say no',
      'Outlook not so good',
      'Very doubtful'
    );
  }

  @Slash('random-8ball', {
    description: 'Ask the 8 Ball a question and see what it has to say.',
  })
  async execute(
    @SlashOption('question', {description: 'What you ask the 8 Ball.'})
    question: string,
    interaction: CommandInteraction
  ) {
    await interaction.reply(
      [
        `:question:  |  **${interaction.user.username}** asked "${question}"`,
        `:8ball:  **says**: \`${this.next}\`.`,
      ].join('\n')
    );
  }
}
