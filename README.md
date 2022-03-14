# triangle-chan

[![discord.js Version][discordjs-image]][discordjs-url]
[![discordx Version][discordx-image]][discordx-url]
[![Release Version][release-image]][release-url]
[![Beta Version][beta-image]][beta-url]
[![Issues][issues-image]][issues-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![TypeScript Style Guide][gts-image]][gts-url]

Triangle-Chan is a [Discord](https://discord.com/) application with a variety of functions.

Users can create "Reaction Roles," "Counter Channels," and more to organize their servers.

## Purpose

- Reaction Roles

- Counter Channels

- About Member / Channel / Server

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

### `date.py`

Running `./date.py` will update the _second_ dateline annotation in each `.ts` file in the `src` directory.

[discordjs-image]: https://img.shields.io/github/package-json/dependency-version/evaneliasyoung/triangle-chan/discord.js?color=5865F2
[discordjs-url]: https://www.npmjs.com/package/discord.js
[discordx-image]: https://img.shields.io/github/package-json/dependency-version/evaneliasyoung/triangle-chan/discordx?color=5865F2
[discordx-url]: https://www.npmjs.com/package/discordx
[release-image]: https://img.shields.io/github/package-json/v/evaneliasyoung/triangle-chan/main?color=brightgreen
[release-url]: https://github.com/evaneliasyoung/triangle-chan
[beta-image]: https://img.shields.io/github/package-json/v/evaneliasyoung/triangle-chan/dev?color=yellow
[beta-url]: https://github.com/evaneliasyoung/triangle-chan/tree/dev
[issues-image]: https://img.shields.io/github/issues/evaneliasyoung/triangle-chan?color=important
[issues-url]: https://github.com/evaneliasyoung/triangle-chan/issues
[snyk-image]: https://snyk.io/test/github/evaneliasyoung/triangle-chan/badge.svg
[snyk-url]: https://snyk.io/test/github/evaneliasyoung/triangle-chan
[snyk-image]: https://snyk.io/test/github/evaneliasyoung/triangle-chan/badge.svg
[snyk-url]: https://snyk.io/test/github/evaneliasyoung/triangle-chan
[gts-image]: https://img.shields.io/badge/code%20style-google-blueviolet.svg
[gts-url]: https://github.com/google/gts
