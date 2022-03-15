#!/usr/bin/env python3
"""
@file      tag.py
@brief     Handles version tagging.
"""

import sys
from typing import Any, Literal, cast
import argparse
from dataclasses import dataclass
from semantic_version import Version
import json
from datetime import datetime as dt
from git import Repo


NOPAD_CHAR: Literal["-", "#"] = "-" if sys.platform != "win32" else "#"


@dataclass
class Arguments:
    version: Version
    dev: bool
    force: bool


def get_args() -> Arguments:
    """Parses the arguments for tagging.

    Returns:
        Arguments: The collection of arguments.
    """
    parser = argparse.ArgumentParser("tag", description="Tags a version for release")
    parser.add_argument(
        "version", metavar="V", type=Version, help="the new release tag"
    )
    parser.add_argument(
        "--dev", "-d", help="development release, does not commit", action="store_true"
    )
    parser.add_argument(
        "--force", "-f", help="skip bad version check", action="store_true"
    )
    return cast(Arguments, parser.parse_args())


def get_package() -> Any:
    """Gets the contents of the package.json file.

    Returns:
        Any: The JSON dictionary.
    """
    with open("package.json", "r") as f:
        return json.load(f)


def get_info() -> list[str]:
    """Gets the contents of the info.ts file.

    Returns:
        list[str]: The list of lines.
    """
    with open("src/info.ts", "r") as f:
        return f.readlines()


def assert_newer_version(ver: Version, pkg: Any) -> None:
    """Asserts that new version is newer than the previous version.

    Args:
        ver (Version): The new version.
        pkg (Any): The package.json contents.

    Raises:
        ValueError: The newer version is older than the previous version.
    """
    if "version" in pkg and ver <= Version(pkg["version"]):
        raise ValueError(ver, pkg["version"])


def update_package(ver: Version, pkg: Any) -> None:
    """Updates the contents of the package.json file.

    Args:
        ver (Version): The new version.
        pkg (Any): The package.json contents.
    """
    pkg["version"] = str(ver)
    with open("package.json", "w") as f:
        json.dump(pkg, f, indent=2, sort_keys=False)
        f.write("\n")


def update_info(ver: Version, info: list[str]) -> None:
    now: dt = dt.now()
    for i in range(len(info) - 1, 0, -1):
        if "export const date" in info[i]:
            info[i] = (
                "  export const date = DateTime.fromObject("
                + now.strftime(
                    f"{{year: %Y, month: %{NOPAD_CHAR}m, day: %{NOPAD_CHAR}d}}"
                )
                + ");\n"
            )
        elif "export const version" in info[i]:
            info[i] = f"  export const version = '{ver}';\n"
    with open("src/info.ts", "w") as f:
        f.writelines(info)


def git(ver: Version) -> None:
    repo = Repo()
    repo.index.add(["package.json", "src/info.ts"])
    repo.index.commit(f":bookmark: {ver}")
    repo.remotes.origin.push()
    repo.git.checkout("main")
    repo.git.merge("dev")
    repo.remotes.origin.push()
    repo.git.checkout("dev")


def main() -> None:
    args = get_args()
    pkg = get_package()
    info = get_info()

    if not args.force:
        assert_newer_version(args.version, pkg)

    update_info(args.version, info)
    update_package(args.version, pkg)

    if not args.dev:
        git(args.version)


if __name__ == "__main__":
    main()
