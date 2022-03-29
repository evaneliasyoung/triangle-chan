# triangle-chan

[![Tests][tests-image]][tests-url]
[![discord.js Version][discordjs-image]][discordjs-url]
[![discordx Version][discordx-image]][discordx-url]
[![triangle-chan Version][version-image]][version-url]
[![Issues][issues-image]][issues-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![TypeScript Style Guide][gts-image]][gts-url]
[![Gitmoji][gitmoji-image]][gitmoji-url]

Triangle-Chan is a [Discord](https://discord.com/) application with a variety of functions.

Users can create "Reaction Roles," "Counter Channels," and more to organize their servers.

## Purpose

- Reaction & Appointed Roles

- Counter Channels

- About Member / Channel / Server

- Text Syling

- Random Numbers

- General Utility

## Environment

```env
CLIENT_ID=the bot has a user id
BOT_TOKEN=your super secret token goes here
LOG_LEVEL=leave this on info
DB_HOST=usually localhost
DB_NAME=name of the schema
DB_USER=username for the schema
DB_PASS=password for the user
```

## Development Scripts

### `tag.py`

```
./tag.py -h
usage: tag [-h] [--dev] [--force] V

Tags a version for release

positional arguments:
  V            the new release tag

optional arguments:
  -h, --help   show this help message and exit
  --dev, -d    development release, does not commit
  --force, -f  skip bad version check
```

Running `./tag.py 1.2.3-b4 -d` will locally make changes to `AppInfo` and `package.json`.

Running `./tag.py 1.2.3` will make changes to the above files, commit, push, merge into `main`, and push again.

[discordjs-image]: https://img.shields.io/github/package-json/dependency-version/evaneliasyoung/triangle-chan/discord.js?color=5865F2
[discordjs-url]: https://www.npmjs.com/package/discord.js
[discordx-image]: https://img.shields.io/github/package-json/dependency-version/evaneliasyoung/triangle-chan/discordx?color=5865F2
[discordx-url]: https://www.npmjs.com/package/discordx
[version-image]: https://img.shields.io/github/package-json/v/evaneliasyoung/triangle-chan?color=brightgreen
[version-url]: https://github.com/evaneliasyoung/triangle-chan
[issues-image]: https://img.shields.io/github/issues/evaneliasyoung/triangle-chan?color=important
[issues-url]: https://github.com/evaneliasyoung/triangle-chan/issues
[snyk-image]: https://snyk.io/test/github/evaneliasyoung/triangle-chan/badge.svg
[snyk-url]: https://snyk.io/test/github/evaneliasyoung/triangle-chan
[snyk-image]: https://snyk.io/test/github/evaneliasyoung/triangle-chan/badge.svg
[snyk-url]: https://snyk.io/test/github/evaneliasyoung/triangle-chan
[gts-image]: https://img.shields.io/badge/code%20style-google-blueviolet.svg
[gts-url]: https://github.com/google/gts
[gitmoji-image]: https://img.shields.io/badge/git-%20😜%20😍-FFDD67.svg
[gitmoji-url]: https://gitmoji.dev
[tests-image]: https://github.com/evaneliasyoung/triangle-chan/actions/workflows/test.yml/badge.svg
[tests-url]: https://github.com/evaneliasyoung/triangle-chan/actions/workflows/test.yml
