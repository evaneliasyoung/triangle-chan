/**
 * @file      env.ts
 * @brief     Environment variable processor.
 */

import * as dotenv from 'dotenv';
import {dirname} from '@discordx/importer';

export const __dirname: string = dirname(import.meta.url);
dotenv.config({path: `${__dirname}/../.env`});

export const CLIENT_ID: string = process.env.CLIENT_ID ?? '';
export const BOT_TOKEN: string = process.env.BOT_TOKEN ?? '';
export const LOG_LEVEL: string = process.env.LOG_LEVEL ?? 'info';

export const DB_HOST: string = process.env.DB_HOST ?? 'localhost';
export const DB_PORT: number | undefined = Number(process.env.DB_PORT);
export const DB_NAME: string = process.env.DB_NAME ?? 'trianglechan';
export const DB_USER: string = process.env.DB_USER ?? 'root';
export const DB_PASS: string = process.env.DB_PASS ?? '';
export const SYNC_DB: boolean = Boolean(Number(process.env.SYNC_DB)) ?? false;

export const SHARD_COUNT: number = Number(process.env.SHARD_COUNT) ?? 5;
export const WEBHOOK_ID: string = process.env.WEBHOOK_ID ?? '';
export const WEBHOOK_TOKEN: string = process.env.WEBHOOK_TOKEN ?? '';

export const VOTE_URL = `https://top.gg/bot/${CLIENT_ID}/vote`;
