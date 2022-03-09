---
--- @file      trianglechan.sql
--- @brief     Generates tables require for Triangle Chan.
---
--- @author    Evan Elias Young
--- @date      2022-03-08
--- @date      2022-03-08
--- @copyright Copyright 2022 Evan Elias Young. All rights reserved.
---

CREATE DATABASE `trianglechan` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `trianglechan`

-- #region trianglechan.category definition
CREATE TABLE `category` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `guildId` varchar(256) NOT NULL,
  `name` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(4096) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `mutuallyExclusive` tinyint(1) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- #endregion

-- #region trianglechan.guild_config definition
CREATE TABLE `guild_config` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- #endregion

-- #region trianglechan.react_message definition
CREATE TABLE `react_message` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `isCustomMessage` tinyint(1) NOT NULL,
  `messageId` varchar(256) NOT NULL,
  `channelId` varchar(256) NOT NULL,
  `emojiId` varchar(256) NOT NULL,
  `categoryId` bigint unsigned NOT NULL,
  `roleId` varchar(256) NOT NULL,
  `guildId` varchar(256) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- #endregion

-- #region trianglechan.react_role definition
CREATE TABLE `react_role` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `roleId` varchar(256) NOT NULL,
  `emojiId` varchar(256) NOT NULL,
  `emojiTag` varchar(256) DEFAULT NULL,
  `guildId` varchar(256) NOT NULL,
  `type` int unsigned NOT NULL,
  `categoryId` bigint unsigned DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- #endregion
