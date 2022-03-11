#!/usr/bin/env python3
"""
@file      date.py
@brief     Updates the second date tag for all files.

@author    Evan Elias Young
@date      2022-02-07
@date      2022-03-11
@copyright Copyright 2022 Evan Elias Young. All rights reserved.
"""

from typing import Optional
from os.path import abspath, getmtime
from datetime import datetime as dt
from re import Pattern, compile as regex
from glob import glob

DATE_MATCH: Pattern[str] = regex(r"(^ \* \@date\s+(\d{4}-\d{2}-\d{2}))$")
DATE_FORMAT: str = "%Y-%m-%d"
GLOB: str = "src/**/*.ts"


def get_src() -> list[str]:
    return list(
        filter(
            lambda path: abspath(path) != abspath(__file__),
            glob(GLOB, recursive=True),
        )
    )


def get_annotation(path: str) -> list[str]:
    return open(path, "r").readlines()[12::-1]


def get_mtime(path: str) -> str:
    return dt.fromtimestamp(getmtime(path)).strftime(DATE_FORMAT)


def get_ftime(path: str) -> Optional[str]:
    for line in get_annotation(path):
        mt = DATE_MATCH.match(line)
        if mt:
            return mt.groups()[1]
    return None


def update_file(path: str, mtime: str) -> None:
    lines: list[str] = open(path).readlines()
    for i in range(len(lines) - 1, 0, -1):
        if DATE_MATCH.match(lines[i]):
            lines[i] = f" * @date      {mtime}\n"
            break
    open(path, "w").writelines(lines)


def main() -> None:
    for path in get_src():
        ftime: Optional[str] = get_ftime(path)
        mtime: str = get_mtime(path)
        if ftime and ftime != mtime:
            update_file(path, mtime)


if __name__ == "__main__":
    main()
