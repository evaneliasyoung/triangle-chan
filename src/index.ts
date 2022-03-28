/**
 * @file      index.ts
 * @brief     Bot bootsrapper.
 */

import 'reflect-metadata';
import {Intents} from 'discord.js';
import {Client} from 'discordx';
import {importx} from '@discordx/importer';
import {
  BOT_TOKEN,
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_PORT,
  DB_USER,
  SYNC_DB,
  __dirname,
} from './env.js';
import {
  logger,
  MessageWithErrorHandlerGenerator,
} from './services/log.service.js';
import {createConnection} from 'typeorm';
import {
  Category,
  Counter,
  GuildConfig,
  ReactMessage,
  ReactRole,
} from './database/database.js';
import PermissionService from './services/permission.service.js';
const permissionService = new PermissionService();
const log = logger(import.meta);
const MessageWithErrorHandler = MessageWithErrorHandlerGenerator(log);

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  partials: ['MESSAGE', 'REACTION', 'CHANNEL', 'GUILD_MEMBER'],
});

permissionService.client = client;

async function run() {
  const path = `${__dirname}/{events,commands}/**/*.ts`;

  await createConnection({
    type: 'mysql',
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    synchronize: SYNC_DB,
    username: DB_USER,
    password: DB_PASS,
    entities: [Category, Counter, GuildConfig, ReactMessage, ReactRole],
  })
    .then(() => {
      log.debug('connected to database');
    })
    .catch(MessageWithErrorHandler('failed to connect to database'));

  await importx(path);
  log.info('imported commands', {path});

  await client.login(BOT_TOKEN);
  log.info('logged in to discord', {BOT_TOKEN});
}

run();
