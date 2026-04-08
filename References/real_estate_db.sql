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
  `status` enum('PUBLISHED','HIDDEN') DEFAULT 'PUBLISHED',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_news_category` (`category`),
  KEY `fk_news_author_idx` (`author_id`),
  FULLTEXT KEY `idx_news_title_ft` (`title`),
  FULLTEXT KEY `idx_news_summary_ft` (`summary`),
  CONSTRAINT `fk_news_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,16,'Đà phát triển mới cho thị trường bất động sản Đà Nẵng','Nhận diện những xung lực mới thúc đẩy thị trường BĐS Đà Nẵng bứt phá trong năm 2026...','/assets/news/news1.png','https://baodanang.vn/da-phat-trien-moi-cho-thi-truong-bat-dong-san-da-nang-3298049.html','Batdongsan.com.vn','MARKET','HIDDEN','2026-03-27 15:47:21','2026-03-29 02:15:28'),(2,16,'Quy hoạch phân khu ven sông Hàn: Cơ hội cho nhà đầu tư','Chi tiết bản đồ quy hoạch các khu đô thị ven sông Hàn vừa được phê duyệt...','/assets/news/news2.png','https://baodanang.vn/da-phat-trien-moi-cho-thi-truong-bat-dong-san-da-nang-3298049.html','Cafeland','PROJECT','PUBLISHED','2026-03-26 15:47:21','2026-03-26 17:09:28'),(3,16,'Thủ tục cấp sổ hồng cho căn hộ chung cư tại Đà Nẵng','Hướng dẫn chi tiết các bước chuẩn bị hồ sơ và quy trình nộp tại văn phòng đất đai...','/assets/news/news3.png','https://baodanang.vn/da-phat-trien-moi-cho-thi-truong-bat-dong-san-da-nang-3298049.html','VnExpress','LAW','PUBLISHED','2026-03-27 15:47:21','2026-03-27 15:47:21'),(4,16,'Cẩm nang mua nhà đất an toàn tại khu vực Ngũ Hành Sơn','Những lưu ý quan trọng về pháp lý và vị trí khi đầu tư tại quận Ngũ Hành Sơn...','/assets/news/news4.png','https://baodanang.vn/da-phat-trien-moi-cho-thi-truong-bat-dong-san-da-nang-3298049.html','Báo Thanh Niên','GUIDE','PUBLISHED','2026-03-25 15:47:21','2026-03-25 17:09:28'),(5,16,'Sức hút từ dự án biệt thự nghỉ dưỡng phía Nam thành phố','Xu hướng sở hữu ngôi nhà thứ hai đang trở lại mạnh mẽ tại các dự án ven biển...','/assets/news/news5.png','https://baodanang.vn/da-phat-trien-moi-cho-thi-truong-bat-dong-san-da-nang-3298049.html','VietnamNet','PROJECT','PUBLISHED','2026-03-24 15:47:21','2026-03-24 17:09:28'),(6,16,'Giá đất nền Liên Chiểu tăng nhẹ nhờ hạ tầng giao thông','Việc triển khai các dự án cầu vượt và mở rộng đường giúp giá đất khu vực này ổn định...','/assets/news/news6.png','https://baodanang.vn/da-phat-trien-moi-cho-thi-truong-bat-dong-san-da-nang-3298049.html','Báo Tuổi Trẻ','MARKET','PUBLISHED','2026-03-24 15:47:21','2026-03-27 17:09:28'),(7,16,'Những thay đổi trong Luật Đất đai ảnh hưởng đến người mua','Phân tích các điều khoản mới nhất tác động trực tiếp đến giao dịch BĐS cá nhân...','/assets/news/news7.png','https://baodanang.vn/da-phat-trien-moi-cho-thi-truong-bat-dong-san-da-nang-3298049.html','Reatimes','LAW','PUBLISHED','2026-03-23 15:47:21','2026-03-23 17:09:28'),(8,16,'Kinh nghiệm vay vốn ngân hàng mua nhà trả góp','Lựa chọn gói vay và lãi suất phù hợp để tối ưu hóa dòng tiền cá nhân...','/assets/news/news8.png','https://baodanang.vn/da-phat-trien-moi-cho-thi-truong-bat-dong-san-da-nang-3298049.html','Cafef','GUIDE','HIDDEN','2026-03-27 15:47:21','2026-03-29 02:15:28'),(9,16,'Tiềm năng phát triển shophouse tại các trục đường chính','Đánh giá khả năng sinh lời từ việc cho thuê và kinh doanh shophouse tại Đà Nẵng...','/assets/news/news9.png','https://baodanang.vn/da-phat-trien-moi-cho-thi-truong-bat-dong-san-da-nang-3298049.html','Báo Lao Động','MARKET','PUBLISHED','2026-03-22 15:47:21','2026-03-22 17:09:28'),(10,16,'Dự báo xu hướng thị trường BĐS Đà Nẵng cuối năm 2026','Các chuyên gia nhận định về kịch bản tăng trưởng của thị trường trong giai đoạn tới...','/assets/news/news10.png','https://baodanang.vn/da-phat-trien-moi-cho-thi-truong-bat-dong-san-da-nang-3298049.html','Báo Đà Nẵng','MARKET','PUBLISHED','2026-03-27 15:47:21','2026-03-21 15:47:21');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'SAVE_POST','lưu bài viết quan tâm'),(2,'CONTACT_OWNER','liên lạc với người đăng bài'),(3,'CREATE_POST','đăng tin'),(4,'PAYMENT_CREATE','tạo url thanh toán'),(5,'VIEW_DASHBOARD','xem dashboard user');
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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_images`
--

LOCK TABLES `post_images` WRITE;
/*!40000 ALTER TABLE `post_images` DISABLE KEYS */;
INSERT INTO `post_images` VALUES (9,25,'/assets/posts/posts1.png','2026-04-01 17:53:17'),(10,25,'/assets/posts/posts2.png','2026-04-01 17:53:17'),(11,25,'/assets/posts/posts3.png','2026-04-01 17:53:17'),(12,25,'/assets/posts/posts4.png','2026-04-01 17:53:17'),(13,25,'/assets/posts/posts5.png','2026-04-01 17:53:17'),(14,26,'/assets/posts/posts1.png','2026-04-01 18:01:47'),(15,26,'/assets/posts/posts2.png','2026-04-01 18:01:47'),(16,26,'/assets/posts/posts3.png','2026-04-01 18:01:47'),(17,26,'/assets/posts/posts4.png','2026-04-01 18:01:47'),(18,26,'/assets/posts/posts5.png','2026-04-01 18:01:47'),(19,27,'/assets/posts/posts5.png','2026-04-01 19:11:14'),(20,27,'/assets/posts/posts6.png','2026-04-01 19:11:14'),(21,27,'/assets/posts/posts7.png','2026-04-01 19:11:14'),(22,28,'/assets/posts/posts2.png','2026-04-01 19:28:25'),(23,28,'/assets/posts/posts3.png','2026-04-01 19:28:25'),(24,28,'/assets/posts/posts4.png','2026-04-01 19:28:25'),(25,29,'/assets/posts/posts3.png','2026-04-01 19:41:15'),(26,29,'/assets/posts/posts4.png','2026-04-01 19:41:15'),(27,29,'/assets/posts/posts5.png','2026-04-01 19:41:15'),(28,30,'/assets/posts/posts3.png','2026-04-01 20:20:51'),(29,30,'/assets/posts/posts4.png','2026-04-01 20:20:51'),(30,30,'/assets/posts/posts10.png','2026-04-01 20:20:51'),(31,31,'/assets/posts/posts4.png','2026-04-02 12:45:44'),(32,31,'/assets/posts/posts5.png','2026-04-02 12:45:44'),(33,32,'/assets/posts/posts3.png','2026-04-02 13:02:24'),(34,32,'/assets/posts/posts4.png','2026-04-02 13:02:24'),(35,32,'/assets/posts/posts5.png','2026-04-02 13:02:24');
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
  `price` decimal(20,2) NOT NULL,
  `area` decimal(10,2) NOT NULL,
  `property_type` enum('LAND','HOUSE','APARTMENT') NOT NULL,
  `listing_type` enum('SALE','RENT') NOT NULL,
  `legal_status` enum('SO_DO','SO_HONG','HD_MUA_BAN','GIAY_TAY','DANG_CHO_SO') NOT NULL,
  `description` text NOT NULL,
  `status` enum('PENDING','APPROVED','DELETED','REJECTED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_post_user_idx` (`user_id`),
  KEY `fk_post_ward_idx` (`ward_id`),
  KEY `idx_posts_status_date` (`updated_at`,`status`),
  CONSTRAINT `fk_post_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_post_ward` FOREIGN KEY (`ward_id`) REFERENCES `wards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (12,26,20242,'Căn hộ khách sạn view Cầu Rồng',2,2,'Đường Bạch Đằng','/assets/posts/posts2.png',5800000000.00,78.50,'APARTMENT','SALE','SO_HONG','Full nội thất cao cấp, view triệu đô trực diện sông Hàn.','APPROVED','2026-02-15 10:00:00','2026-03-30 12:02:37'),(13,26,20285,'Villa mini gần bãi tắm Non Nước',4,3,'Đường Trường Sa','/assets/posts/posts3.png',8200000000.00,150.00,'HOUSE','SALE','SO_HONG','Thích hợp làm Homestay, khu vực an ninh, dân trí cao.','APPROVED','2026-03-10 14:00:00','2026-03-30 12:02:37'),(14,26,20263,'Cho thuê nhà mặt tiền kinh doanh du lịch',3,2,'Đường Võ Văn Kiệt','/assets/posts/posts4.png',25000000.00,90.00,'HOUSE','RENT','SO_HONG','Vị trí đắc địa gần biển, thuận tiện mở spa hoặc văn phòng.','APPROVED','2026-03-27 08:15:00','2026-03-30 12:02:37'),(15,26,20260,'Lô góc 2 mặt tiền Nguyễn Hữu Thọ',0,0,'Trục đường chính','/assets/posts/posts5.png',5200000000.00,125.00,'LAND','SALE','SO_DO','Kinh doanh mọi ngành nghề, sổ đỏ sẵn sàng công chứng.','APPROVED','2026-02-20 09:00:00','2026-03-30 12:02:37'),(16,26,20209,'Nhà kiệt ô tô Điện Biên Phủ giá rẻ',2,1,'Kiệt 234 Điện Biên Phủ','/assets/posts/posts6.png',2150000000.00,60.00,'HOUSE','SALE','GIAY_TAY','Khu vực trung tâm, gần chợ, thuận tiện đi lại.','APPROVED','2026-03-20 10:30:00','2026-03-30 12:02:37'),(17,26,20197,'Đất nền shophouse Nguyễn Sinh Sắc',0,0,'Trục 60m','/assets/posts/posts7.png',4700000000.00,105.00,'LAND','SALE','HD_MUA_BAN','Pháp lý minh bạch, cơ hội đầu tư sinh lời cao.','APPROVED','2026-01-10 07:00:00','2026-03-30 12:02:37'),(18,26,20260,'Căn hộ chung cư nhà ở xã hội',1,1,'Lê Đại Hành','/assets/posts/posts8.png',920000000.00,52.00,'APARTMENT','SALE','DANG_CHO_SO','Thích hợp cho vợ chồng trẻ, đầy đủ tiện ích nội khu.','APPROVED','2026-03-10 15:00:00','2026-03-30 12:02:37'),(19,26,20410,'Đất trung tâm Hội An giá sụp hầm',0,0,'Trần Phú','/assets/posts/posts9.png',12500000000.00,110.00,'LAND','SALE','SO_DO','Chủ cần tiền bán gấp, tin đang đợi quản trị viên duyệt.','PENDING','2026-03-30 11:00:00','2026-03-30 12:02:37'),(20,26,20320,'Đất vườn Hòa Vang sinh thái',0,0,'Xã Hòa Tiến','/assets/posts/posts10.png',1600000000.00,500.00,'LAND','SALE','SO_DO','Tin đăng cũ đã bị xóa khỏi hệ thống.','DELETED','2026-01-01 10:00:00','2026-03-30 12:02:37'),(25,26,20197,'Bán đất nền kiệt ôtô đường Ngô Thì Nhậm, Liên Chiểu',1,1,'K123 Ngô Thì Nhậm','/assets/posts/posts6.png',2850000000.00,100.50,'HOUSE','SALE','SO_DO','Đất chính chủ, gần trường Đại học Bách Khoa Đà Nẵng, khu dân cư đông đúc, an ninh tốt.','PENDING','2026-04-01 17:53:16','2026-04-01 17:53:16'),(26,26,20194,'căn hộ cao cấp',4,4,'k123 Nguyễn Lương Bằng','/assets/posts/posts9.png',10000000000.00,100.00,'APARTMENT','SALE','SO_DO','căn hộ cao cấp hải vân','PENDING','2026-04-01 18:01:47','2026-04-01 18:01:47'),(27,26,20332,'aaaaaaaaaaaaaaaaaaaaaa',1,1,'aaaaa','/assets/posts/posts4.png',100000000.00,123.00,'APARTMENT','SALE','SO_HONG','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','PENDING','2026-04-01 19:11:14','2026-04-01 19:11:14'),(28,26,20194,'aaaaaaaaaaaaaaaaaaa',1,1,'aaaaaaaaaaa','/assets/posts/posts1.png',1000000000000000.00,100.00,'APARTMENT','SALE','SO_DO','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','PENDING','2026-04-01 19:28:24','2026-04-01 19:28:24'),(29,26,20285,'aaaaaaaaaaaaaaaaaaaaaaaa',1,1,'K123 Ngo Thi Nham','/assets/posts/posts1.png',100000000.00,1000.00,'APARTMENT','SALE','SO_DO','aaaaaaaaaaaaaaaaaaaaaaaaa','PENDING','2026-04-01 19:41:15','2026-04-01 19:41:15'),(30,26,20194,'âaaaaaaaaaaaaaaaa',1,1,'aaaaaa','/assets/posts/posts1.png',11111111111111.00,11.00,'HOUSE','RENT','GIAY_TAY','aaaaaaaaaaaaaaaaaaaaaaaaa','PENDING','2026-04-01 20:20:51','2026-04-01 20:20:51'),(31,26,20194,'test đăng tin mới',1,1,'K123 Ngo Thi Nham','/assets/posts/posts8.png',1200000000.00,123.00,'APARTMENT','SALE','SO_DO','tttttttttttttttttttttttt','PENDING','2026-04-02 12:45:44','2026-04-02 12:45:44'),(32,26,20200,'aaaaaaaaaaaa',1,1,'K123 Ngo Thi Nham','/assets/posts/posts2.png',1111111111.00,111111.00,'HOUSE','SALE','SO_DO','aaaaaaaaaaaaaaaaaaaa','PENDING','2026-04-02 13:02:24','2026-04-02 13:02:24');
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
INSERT INTO `role_permission` VALUES (2,1),(2,2),(2,3),(2,4),(2,5);
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
  `status` enum('PENDING','SUCCESS','FAILED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_trans_user` (`user_id`),
  KEY `idx_trans_post` (`post_id`),
  CONSTRAINT `fk_trans_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_trans_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,26,100000.00,'DEPOSIT','Nap tien Goi 1',NULL,'76595754','15479476','SUCCESS','2026-04-02 11:05:24'),(2,26,100000.00,'DEPOSIT','Nap tien Goi 1',NULL,'92458163','15479483','SUCCESS','2026-04-02 11:14:09'),(3,26,500000.00,'DEPOSIT','Nap tien Goi 3',NULL,'97061377','15479522','SUCCESS','2026-04-02 11:29:39'),(4,26,200000.00,'DEPOSIT','Nap tien Goi 2',NULL,'22485119',NULL,'FAILED','2026-04-02 11:34:39'),(5,26,200000.00,'DEPOSIT','Nap tien Goi 2',NULL,'09637440',NULL,'FAILED','2026-04-02 11:36:35'),(6,26,200000.00,'DEPOSIT','Nap tien Goi 2',NULL,'69248517',NULL,'PENDING','2026-04-02 11:37:08'),(7,26,200000.00,'DEPOSIT','Nap tien Goi 2',NULL,'66837809',NULL,'FAILED','2026-04-02 12:15:22'),(8,26,100000.00,'DEPOSIT','Nap tien Goi 1',NULL,'33863595',NULL,'FAILED','2026-04-02 12:16:24'),(9,26,200000.00,'DEPOSIT','Nap tien Goi 2',NULL,'68959517',NULL,'FAILED','2026-04-02 12:17:00'),(10,26,100000.00,'DEPOSIT','Nap tien Goi 1',NULL,'81212623',NULL,'FAILED','2026-04-02 12:17:10'),(11,26,500000.00,'DEPOSIT','Nap tien Goi 3',NULL,'19066898',NULL,'FAILED','2026-04-02 12:17:23'),(12,26,100000.00,'DEPOSIT','Nap tien Goi 1',NULL,'70637986',NULL,'FAILED','2026-04-02 12:18:18'),(13,26,200000.00,'DEPOSIT','Nap tien Goi 2',NULL,'24151917',NULL,'FAILED','2026-04-02 12:19:50'),(14,26,100000.00,'DEPOSIT','Nap tien Goi 1',NULL,'81404650',NULL,'PENDING','2026-04-02 12:21:33'),(15,26,100000.00,'DEPOSIT','Nap tien Goi 1',NULL,'42070091','15479632','SUCCESS','2026-04-02 12:43:43'),(16,26,23003.00,'POST_FEE','Phí đăng tin cho bài: test đăng tin mới',31,NULL,NULL,'SUCCESS','2026-04-02 12:45:44'),(17,26,23003.00,'POST_FEE','Phí đăng tin cho bài: aaaaaaaaaaaa',32,NULL,NULL,'SUCCESS','2026-04-02 13:02:24'),(18,26,500000.00,'DEPOSIT','Nap tien Goi 3',NULL,'17215197',NULL,'PENDING','2026-04-02 13:03:10'),(19,26,100000.00,'DEPOSIT','Nap tien Goi 1',NULL,'63149683',NULL,'FAILED','2026-04-02 13:03:46'),(20,26,100000.00,'DEPOSIT','Nap tien Goi 1',NULL,'55485555',NULL,'FAILED','2026-04-02 13:04:52'),(21,26,100000.00,'DEPOSIT','Nap tien Goi 1',NULL,'92364809','15479649','SUCCESS','2026-04-02 13:05:58'),(22,26,100000.00,'DEPOSIT','Nap tien Goi 1',NULL,'07248742','15480230','SUCCESS','2026-04-02 19:18:13'),(23,26,100000.00,'DEPOSIT','Nap tien Goi 1',NULL,'21410763','15480234','SUCCESS','2026-04-02 19:21:46'),(24,26,100000.00,'DEPOSIT','Nap tien Goi 1',NULL,'02601668','15480237','SUCCESS','2026-04-02 19:30:29');
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
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_interactions`
--

LOCK TABLES `user_interactions` WRITE;
/*!40000 ALTER TABLE `user_interactions` DISABLE KEYS */;
INSERT INTO `user_interactions` VALUES (81,26,12,'VIEW','2026-04-01 18:13:54'),(82,26,12,'VIEW','2026-04-01 18:22:24'),(85,26,12,'VIEW','2026-04-01 18:25:21'),(89,26,12,'VIEW','2026-04-01 18:30:43'),(90,26,12,'VIEW','2026-04-01 18:40:27'),(91,26,12,'VIEW','2026-04-01 18:44:33'),(93,26,12,'VIEW','2026-04-01 19:06:05'),(94,26,12,'VIEW','2026-04-01 19:08:43'),(95,26,12,'VIEW','2026-04-01 20:19:05'),(96,26,12,'CONTACT','2026-04-01 20:19:12'),(97,26,12,'VIEW','2026-04-02 12:50:40');
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
INSERT INTO `user_role` VALUES (16,1),(26,2);
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
  `avatar_url` varchar(255) DEFAULT '/assets/default.png',
  `balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `is_verified` tinyint unsigned DEFAULT '0',
  `is_locked` tinyint unsigned DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  KEY `idx_users_full_name` (`full_name`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (16,'admin2003@gmail.com','$2a$10$K6Iz7PO0BQ20i33fbSYJIOW8AaPA0Q5WQ3Bs4FTd4APnrIzz7NkrS','Bùi Ngọc Dân','0352290191',0,NULL,NULL,'/assets/default.png',0.00,1,0,'2026-03-27 19:56:58','2026-04-02 04:45:48'),(26,'buingocdan2003@gmail.com','$2a$10$dVSfgWKPFQtnmme0IwFiyu94XZTPeSGmXKXG2bDHpvVroslhJujmq','buingocdan','0352290195',0,NULL,NULL,'/assets/users/posts2.png',200000.00,1,0,'2026-03-30 18:57:52','2026-04-02 19:33:57');
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

--
-- Dumping routines for database 'real_estate_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-06 20:43:06
