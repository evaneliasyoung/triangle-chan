/**
 * @file      index.ts
 * @brief     Bot bootsrapper.
 *
 * @author    Evan Elias Young
 * @date      2022-03-05
 * @date      2022-03-05
 * @copyright Copyright 2022 Evan Elias Young. All rights reserved.
 */

import 'reflect-metadata';
import { Intents } from 'discord.js';
import { Client } from 'discordx';
import { importx } from '@discordx/importer';
import { BOT_TOKEN, DB_PASS, DB_URL, DB_USER, SYNC_DB, __dirname } from './env.js';
import { logger } from './services/log.service.js';
import { createConnection } from 'typeorm';
import { ReactMessage, ReactRole, Category, GuildConfig } from './database/entities/index.js';
const log = logger(import.meta);

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES
  ],
  partials: ['MESSAGE', 'REACTION', 'CHANNEL', 'GUILD_MEMBER']
});

async function run() {
  const path: string = `${__dirname}/{events,commands}/**/*.ts`;

  await createConnection({
    type: 'mysql',
    url: DB_URL,
    synchronize: SYNC_DB,
    username: DB_USER,
    password: DB_PASS,
    entities: [ReactMessage, ReactRole, Category, GuildConfig],
  })
    .then(() => { log.debug(`connected to database`); })
    .catch(e => { log.error(`failed to connect to database`, e); });

  await importx(path);
  log.info('imported commands', { path });

  await client.login(BOT_TOKEN);
  log.info('logged in to discord', { BOT_TOKEN });
}

run();
