CREATE DATABASE  IF NOT EXISTS `real_estate_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `real_estate_db`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: real_estate_db
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `author_id` bigint unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `summary` text,
  `thumbnail_url` varchar(255) NOT NULL,
  `original_url` varchar(500) NOT NULL,
  `source_name` varchar(100) DEFAULT NULL,
  `category` enum('MARKET','GUIDE','LAW','PROJECT') DEFAULT 'MARKET',
  `status` enum('PUBLISHED','HIDDEN','DRAFT') DEFAULT 'PUBLISHED',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_news_category` (`category`),
  KEY `fk_news_author_idx` (`author_id`),
  FULLTEXT KEY `idx_news_title_ft` (`title`),
  CONSTRAINT `fk_news_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_images`
--

DROP TABLE IF EXISTS `post_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint unsigned NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_img_post_idx` (`post_id`),
  CONSTRAINT `fk_img_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_images`
--

LOCK TABLES `post_images` WRITE;
/*!40000 ALTER TABLE `post_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `ward_id` int unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `bedrooms` int unsigned DEFAULT '0',
  `bathrooms` int unsigned DEFAULT '0',
  `street_address` varchar(255) NOT NULL,
  `thumbnail_url` varchar(255) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `area` decimal(10,2) NOT NULL,
  `property_type` enum('LAND','HOUSE','APARTMENT') NOT NULL,
  `listing_type` enum('SALE','RENT') NOT NULL,
  `legal_status` enum('SO_DO','SO_HONG','HD_MUA_BAN','GIAY_TAY','DANG_CHO_SO') NOT NULL,
  `description` text NOT NULL,
  `status` enum('PENDING','APPROVED','SOLD','REJECTED','DELETED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_post_user_idx` (`user_id`),
  KEY `fk_post_ward_idx` (`ward_id`),
  KEY `idx_posts_status_date` (`updated_at`,`status`),
  CONSTRAINT `fk_post_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_post_ward` FOREIGN KEY (`ward_id`) REFERENCES `wards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permission`
--

DROP TABLE IF EXISTS `role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permission` (
  `role_id` int unsigned NOT NULL,
  `permission_id` int unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `fk_rp_role_idx` (`role_id`),
  KEY `fk_rp_perm_idx` (`permission_id`),
  CONSTRAINT `fk_rp_perm` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permission`
--

LOCK TABLES `role_permission` WRITE;
/*!40000 ALTER TABLE `role_permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN','Quản trị viên có toàn quyền'),(2,'USER','Người dùng website');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `type` enum('DEPOSIT','POST_FEE','REFUND') NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `post_id` bigint unsigned DEFAULT NULL,
  `vnp_txn_ref` varchar(100) DEFAULT NULL,
  `vnp_transaction_no` varchar(100) DEFAULT NULL,
  `status` enum('PENDING','SUCCESS','FAILED') DEFAULT 'SUCCESS',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_trans_user` (`user_id`),
  KEY `idx_trans_post` (`post_id`),
  CONSTRAINT `fk_trans_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_trans_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_interactions`
--

DROP TABLE IF EXISTS `user_interactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_interactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `post_id` bigint unsigned NOT NULL,
  `interaction_type` enum('VIEW','SAVE','CONTACT') NOT NULL DEFAULT 'VIEW',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_fav_post_idx` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_fav_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_fav_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_interactions`
--

LOCK TABLES `user_interactions` WRITE;
/*!40000 ALTER TABLE `user_interactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_interactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `user_id` bigint unsigned NOT NULL,
  `role_id` int unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `fk_ur_user_idx` (`user_id`),
  KEY `fk_ur_role_idx` (`role_id`),
  CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `gender` tinyint unsigned DEFAULT '0',
  `birthday` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT 'default.png',
  `balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `is_verified` tinyint unsigned DEFAULT '0',
  `is_locked` tinyint unsigned DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  KEY `idx_users_full_name` (`full_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wards`
--

DROP TABLE IF EXISTS `wards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wards` (
  `id` int unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wards`
--

LOCK TABLES `wards` WRITE;
/*!40000 ALTER TABLE `wards` DISABLE KEYS */;
INSERT INTO `wards` VALUES (20194,'phường Hải Vân'),(20197,'phường Liên Chiểu'),(20200,'phường Hòa Khánh'),(20209,'phường Thanh Khê'),(20242,'phường Hải Châu'),(20257,'phường Hòa Cường'),(20260,'phường Cẩm Lệ'),(20263,'phường Sơn Trà'),(20275,'phường An Hải'),(20285,'phường Ngũ Hành Sơn'),(20305,'phường An Khê'),(20308,'xã Bà Nà'),(20314,'phường Hòa Xuân'),(20320,'xã Hòa Vang'),(20332,'xã Hòa Tiến'),(20333,'đặc khu Hoàng Sa'),(20335,'phường Bàn Thạch'),(20341,'phường Tam Kỳ'),(20350,'phường Hương Trà'),(20356,'phường Quảng Phú'),(20364,'xã Chiên Đàn'),(20380,'xã Tây Hồ'),(20392,'xã Phú Ninh'),(20401,'phường Hội An Tây'),(20410,'phường Hội An'),(20413,'phường Hội An Đông'),(20434,'xã Tân Hiệp'),(20443,'xã Hùng Sơn'),(20455,'xã Tây Giang'),(20458,'xã Avương'),(20467,'xã Đông Giang'),(20476,'xã Sông Kôn'),(20485,'xã Sông Vàng'),(20494,'xã Bến Hiên'),(20500,'xã Đại Lộc'),(20506,'xã Thượng Đức'),(20515,'xã Hà Nha'),(20539,'xã Vu Gia'),(20542,'xã Phú Thuận'),(20551,'phường Điện Bàn'),(20557,'phường Điện Bàn Bắc'),(20569,'xã Điện Bàn Tây'),(20575,'phường An Thắng'),(20579,'phường Điện Bàn Đông'),(20587,'xã Gò Nổi'),(20599,'xã Nam Phước'),(20611,'xã Thu Bồn'),(20623,'xã Duy Xuyên'),(20635,'xã Duy Nghĩa'),(20641,'xã Quế Sơn'),(20650,'xã Xuân Phú'),(20656,'xã Nông Sơn'),(20662,'xã Quế Sơn Trung'),(20669,'xã Quế Phước'),(20695,'xã Thạnh Mỹ'),(20698,'xã La Êê'),(20704,'xã La Dêê'),(20707,'xã Nam Giang'),(20710,'xã Bến Giằng'),(20716,'xã Đắc Pring'),(20722,'xã Khâm Đức'),(20728,'xã Phước Hiệp'),(20734,'xã Phước Năng'),(20740,'xã Phước Chánh'),(20752,'xã Phước Thành'),(20767,'xã Việt An'),(20770,'xã Phước Trà'),(20779,'xã Hiệp Đức'),(20791,'xã Thăng Bình'),(20794,'xã Thăng An'),(20818,'xã Đồng Dương'),(20827,'xã Thăng Phú'),(20836,'xã Thăng Trường'),(20848,'xã Thăng Điền'),(20854,'xã Tiên Phước'),(20857,'xã Sơn Cẩm Hà'),(20875,'xã Lãnh Ngọc'),(20878,'xã Thạnh Bình'),(20900,'xã Trà My'),(20908,'xã Trà Liên'),(20920,'xã Trà Đốc'),(20923,'xã Trà Tân'),(20929,'xã Trà Giáp'),(20938,'xã Trà Leng'),(20941,'xã Trà Tập'),(20944,'xã Nam Trà My'),(20950,'xã Trà Linh'),(20959,'xã Trà Vân'),(20965,'xã Núi Thành'),(20971,'xã Tam Xuân'),(20977,'xã Đức Phú'),(20984,'xã Tam Anh'),(20992,'xã Tam Hải'),(21004,'xã Tam Mỹ');
/*!40000 ALTER TABLE `wards` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-23 17:26:57
