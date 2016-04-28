-- MySQL dump 10.13  Distrib 5.5.47, for debian-linux-gnu (armv7l)
--
-- Host: localhost    Database: CleoHomeDB
-- ------------------------------------------------------
-- Server version	5.5.47-0+deb7u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `CleoHomeDB`
--

/*!40000 DROP DATABASE IF EXISTS `CleoHomeDB`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `CleoHomeDB` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `CleoHomeDB`;

--
-- Table structure for table `Alarm_Arm_Modes`
--

DROP TABLE IF EXISTS `Alarm_Arm_Modes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Alarm_Arm_Modes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Mode` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Mode` (`Mode`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Alarm_Arm_Modes`
--

LOCK TABLES `Alarm_Arm_Modes` WRITE;
/*!40000 ALTER TABLE `Alarm_Arm_Modes` DISABLE KEYS */;
INSERT INTO `Alarm_Arm_Modes` VALUES (1,'Away'),(5,'Night'),(2,'Stay'),(3,'Zero_Entry_Away'),(4,'Zero_Entry_Stay');
/*!40000 ALTER TABLE `Alarm_Arm_Modes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Alarm_Item_Types`
--

DROP TABLE IF EXISTS `Alarm_Item_Types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Alarm_Item_Types` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Type` (`Type`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Alarm_Item_Types`
--

LOCK TABLES `Alarm_Item_Types` WRITE;
/*!40000 ALTER TABLE `Alarm_Item_Types` DISABLE KEYS */;
INSERT INTO `Alarm_Item_Types` VALUES (13,'AC'),(14,'Alarm_connection_status'),(5,'Arm/Disarm'),(12,'Battery'),(11,'Night_Mode_Status'),(4,'Night_Zone'),(6,'Panic'),(9,'Partition'),(10,'Partition_ledState'),(8,'Spare Item Type'),(7,'Spare Zone'),(3,'Zone Door'),(2,'Zone_External'),(1,'Zone_Internal');
/*!40000 ALTER TABLE `Alarm_Item_Types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Alarm_Items`
--

DROP TABLE IF EXISTS `Alarm_Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Alarm_Items` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Type` int(11) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Current_State` int(11) NOT NULL,
  `Last_Trig` int(11) DEFAULT NULL,
  `Alarm_Event` varchar(100) DEFAULT NULL,
  `Time_Updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Name` (`Name`),
  UNIQUE KEY `Description` (`Description`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Alarm_Items`
--

LOCK TABLES `Alarm_Items` WRITE;
/*!40000 ALTER TABLE `Alarm_Items` DISABLE KEYS */;
INSERT INTO `Alarm_Items` VALUES (1,'Zone_001',3,'Front Door',2,NULL,NULL,'2016-04-25 13:11:52'),(2,'Zone_002',3,'Living Room Door',2,NULL,NULL,'2016-04-27 16:57:26'),(3,'Zone_003',1,'Living Room',2,NULL,NULL,'2016-04-27 18:10:00'),(4,'Zone_004',3,'Kitchen Door',1,NULL,NULL,'2016-04-27 15:08:49'),(5,'Zone_005',3,'Office Door',2,NULL,NULL,'0000-00-00 00:00:00'),(6,'Zone_006',1,'Office',2,NULL,NULL,'2016-04-27 18:37:28'),(7,'Zone_007',4,'Hallway',2,NULL,NULL,'2016-04-27 18:36:12'),(8,'Zone_008',4,'Main Bedroom',2,NULL,NULL,'2016-04-27 19:07:40'),(9,'Zone_009',1,'Study',2,NULL,NULL,'2016-04-25 08:19:06'),(10,'Zone_010',1,'Kitchen',2,NULL,NULL,'2016-04-27 18:35:56'),(11,'Zone_011',1,'Laundry',2,NULL,NULL,'2016-04-27 18:35:06'),(12,'Zone_012',3,'Laundry Door',2,NULL,NULL,'2016-04-25 13:49:46'),(13,'Zone_013',7,'Spare1',2,NULL,NULL,'0000-00-00 00:00:00'),(14,'Zone_014',2,'Electric Fence',2,NULL,NULL,'0000-00-00 00:00:00'),(15,'Zone_015',5,'AwayArm',2,NULL,NULL,'0000-00-00 00:00:00'),(16,'Zone_016',6,'StayArm',2,NULL,NULL,'0000-00-00 00:00:00'),(17,'Zone_017',2,'Main Gate',2,NULL,NULL,'2016-04-27 15:07:23'),(18,'Zone_018',2,'Driveway',2,NULL,NULL,'2016-04-27 15:07:16'),(19,'Zone_019',2,'Left Garage Door',2,NULL,NULL,'2016-04-27 15:12:31'),(20,'Zone_020',2,'Right Garage Door',2,NULL,NULL,'2016-04-23 14:44:00'),(21,'Zone_021',2,'Wooden Door',2,NULL,NULL,'0000-00-00 00:00:00'),(22,'Zone_022',2,'Front Beam',2,NULL,NULL,'2016-04-25 13:13:56'),(23,'Zone_023',2,'Pool Beam',2,NULL,NULL,'2016-04-25 13:16:22'),(24,'Zone_024',2,'Lapa Beam',2,NULL,NULL,'2016-04-24 15:56:02'),(25,'Zone_025',2,'Lapa',2,NULL,NULL,'2016-04-24 15:47:57'),(26,'Zone_026',2,'Back Beam',2,NULL,NULL,'2016-04-25 18:32:06'),(27,'Zone_027',2,'Side Beam',2,NULL,NULL,'2016-04-25 12:06:58'),(28,'Partition_1',9,'Main Partition',7,NULL,NULL,'2016-04-27 16:54:12'),(29,'Partition_1_ledState',10,'Main Partition LED State',10,NULL,NULL,'2016-04-27 16:54:12'),(30,'Night_Mode_Active',11,'Night mode activated',0,NULL,NULL,'2016-04-26 04:22:07'),(31,'Battery',12,'Battery Status',1,NULL,NULL,'0000-00-00 00:00:00'),(32,'AC',13,'AC Status',1,NULL,NULL,'0000-00-00 00:00:00'),(33,'Alarm_Connection_Status',14,'Alarm Connection Status',18,NULL,NULL,'2014-04-24 05:12:22');
/*!40000 ALTER TABLE `Alarm_Items` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`CleoUser`@`localhost`*/ /*!50003 TRIGGER Catch_Alarm_Event AFTER UPDATE ON Alarm_Items FOR EACH ROW INSERT INTO Event_Log SET Type = "Alarm", Event = concat("{""Zone"":""",New.Description,""",""Current_State"":""",New.Current_State,"""}"),Time = NOW() */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Alarm_States`
--

DROP TABLE IF EXISTS `Alarm_States`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Alarm_States` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `State` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `State` (`State`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Alarm_States`
--

LOCK TABLES `Alarm_States` WRITE;
/*!40000 ALTER TABLE `Alarm_States` DISABLE KEYS */;
INSERT INTO `Alarm_States` VALUES (12,'Alarm'),(20,'Armed'),(6,'Armed in Away Mode'),(10,'Armed in Night Mode'),(7,'Armed in Stay Mode'),(9,'Armed in Zero Entry_Stay Mode'),(8,'Armed in Zero_Entry_Away Mode'),(16,'Busy'),(18,'Connected'),(11,'Disarmed'),(14,'Entry Delay'),(13,'Exit Delay'),(15,'Failed Arm'),(4,'Not Ready'),(19,'Not_Connected'),(1,'Opened'),(3,'Ready'),(5,'Ready for force arm'),(2,'Restored'),(17,'Tamper'),(21,'Unknown');
/*!40000 ALTER TABLE `Alarm_States` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Alarm_Triggers`
--

DROP TABLE IF EXISTS `Alarm_Triggers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Alarm_Triggers` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Zone` varchar(45) NOT NULL,
  `Time` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=342 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Alarm_Triggers`
--

LOCK TABLES `Alarm_Triggers` WRITE;
/*!40000 ALTER TABLE `Alarm_Triggers` DISABLE KEYS */;
INSERT INTO `Alarm_Triggers` VALUES (1,'Driveway','Thu Jan 29 2015 07:56:04 GMT+0200 (SAST)'),(2,'Driveway','Thu Jan 29 2015 07:56:04 GMT+0200 (SAST)'),(3,'Driveway','Fri Jan 30 2015 05:39:58 GMT+0200 (SAST)'),(4,'Driveway','Fri Jan 30 2015 05:39:58 GMT+0200 (SAST)'),(5,'Back Beam','Sun Feb 01 2015 20:39:36 GMT+0200 (SAST)'),(6,'Back Beam','Sun Feb 01 2015 20:39:36 GMT+0200 (SAST)'),(7,'Lapa','Tue Feb 03 2015 13:15:45 GMT+0200 (SAST)'),(8,'Lapa','Tue Feb 03 2015 13:15:45 GMT+0200 (SAST)'),(9,'Lapa','Tue Feb 03 2015 13:22:34 GMT+0200 (SAST)'),(10,'Lapa','Tue Feb 03 2015 13:22:34 GMT+0200 (SAST)'),(11,'Lapa','Tue Feb 03 2015 13:29:38 GMT+0200 (SAST)'),(12,'Lapa','Tue Feb 03 2015 13:29:38 GMT+0200 (SAST)'),(13,'Front Beam','Tue Feb 03 2015 14:44:50 GMT+0200 (SAST)'),(14,'Front Beam','Tue Feb 03 2015 14:44:50 GMT+0200 (SAST)'),(15,'AwayArm','Thu Feb 05 2015 16:33:45 GMT+0200 (SAST)'),(16,'AwayArm','Thu Feb 05 2015 16:33:45 GMT+0200 (SAST)'),(17,'Back Beam','Sat Feb 07 2015 15:26:59 GMT+0200 (SAST)'),(18,'Back Beam','Sat Feb 07 2015 15:26:59 GMT+0200 (SAST)'),(19,'Back Beam','Sat Feb 07 2015 15:29:45 GMT+0200 (SAST)'),(20,'Back Beam','Sat Feb 07 2015 15:29:45 GMT+0200 (SAST)'),(21,'Hallway','Tue Feb 10 2015 20:02:03 GMT+0200 (SAST)'),(22,'Hallway','Tue Feb 10 2015 20:02:03 GMT+0200 (SAST)'),(23,'Main Bedroom','Sun Feb 15 2015 02:34:41 GMT+0200 (SAST)'),(24,'Main Bedroom','Sun Feb 15 2015 02:34:41 GMT+0200 (SAST)'),(25,'Side Beam','Tue Feb 17 2015 02:13:22 GMT+0200 (SAST)'),(26,'Side Beam','Tue Feb 17 2015 02:13:22 GMT+0200 (SAST)'),(27,'AwayArm','Tue Feb 17 2015 02:13:53 GMT+0200 (SAST)'),(28,'AwayArm','Tue Feb 17 2015 02:13:53 GMT+0200 (SAST)'),(29,'Front Beam','Tue Feb 17 2015 13:09:30 GMT+0200 (SAST)'),(30,'Front Beam','Tue Feb 17 2015 13:09:30 GMT+0200 (SAST)'),(31,'AwayArm','Wed Mar 04 2015 21:56:32 GMT+0200 (SAST)'),(32,'AwayArm','Wed Mar 04 2015 21:56:32 GMT+0200 (SAST)'),(33,'Back Beam','Thu Mar 19 2015 10:34:28 GMT+0200 (SAST)'),(34,'Back Beam','Thu Mar 19 2015 10:34:28 GMT+0200 (SAST)'),(35,'Driveway','Sat Mar 21 2015 08:28:20 GMT+0200 (SAST)'),(36,'Driveway','Sat Mar 21 2015 08:28:20 GMT+0200 (SAST)'),(37,'Back Beam','Tue Mar 24 2015 09:33:46 GMT+0200 (SAST)'),(38,'Back Beam','Tue Mar 24 2015 09:33:46 GMT+0200 (SAST)'),(39,'Back Beam','Tue Mar 24 2015 11:34:24 GMT+0200 (SAST)'),(40,'Back Beam','Tue Mar 24 2015 11:34:24 GMT+0200 (SAST)'),(41,'Main Bedroom','Wed Mar 25 2015 15:50:44 GMT+0200 (SAST)'),(42,'Main Bedroom','Wed Mar 25 2015 15:50:44 GMT+0200 (SAST)'),(43,'Driveway','Tue Mar 31 2015 17:58:55 GMT+0200 (SAST)'),(44,'Driveway','Tue Mar 31 2015 17:58:55 GMT+0200 (SAST)'),(45,'Driveway','Tue Mar 31 2015 17:58:55 GMT+0200 (SAST)'),(46,'Back Beam','Thu Apr 02 2015 12:52:37 GMT+0200 (SAST)'),(47,'Back Beam','Thu Apr 02 2015 12:52:37 GMT+0200 (SAST)'),(48,'Back Beam','Thu Apr 02 2015 13:16:17 GMT+0200 (SAST)'),(49,'Back Beam','Thu Apr 02 2015 13:16:17 GMT+0200 (SAST)'),(50,'Back Beam','Sat Apr 04 2015 18:10:15 GMT+0200 (SAST)'),(51,'Back Beam','Sat Apr 04 2015 18:10:15 GMT+0200 (SAST)'),(52,'Pool Beam','Sat Apr 11 2015 12:54:42 GMT+0200 (SAST)'),(53,'Pool Beam','Sat Apr 11 2015 12:54:42 GMT+0200 (SAST)'),(54,'Wooden Door','Wed Apr 15 2015 01:47:00 GMT+0200 (SAST)'),(55,'Wooden Door','Wed Apr 15 2015 01:47:00 GMT+0200 (SAST)'),(56,'Spare2','Sun Apr 19 2015 18:08:50 GMT+0200 (SAST)'),(57,'Spare2','Sun Apr 19 2015 18:08:51 GMT+0200 (SAST)'),(58,'Driveway','Mon Apr 20 2015 16:19:36 GMT+0200 (SAST)'),(59,'Driveway','Mon Apr 20 2015 16:19:36 GMT+0200 (SAST)'),(60,'AwayArm','Mon Apr 20 2015 16:19:47 GMT+0200 (SAST)'),(61,'AwayArm','Mon Apr 20 2015 16:19:47 GMT+0200 (SAST)'),(62,'Driveway','Sat Apr 25 2015 13:54:45 GMT+0200 (SAST)'),(63,'Driveway','Sat Apr 25 2015 13:54:45 GMT+0200 (SAST)'),(64,'Driveway','Wed Apr 29 2015 02:25:27 GMT+0200 (SAST)'),(65,'Driveway','Wed Apr 29 2015 02:25:27 GMT+0200 (SAST)'),(66,'Hallway','Wed Apr 29 2015 02:26:14 GMT+0200 (SAST)'),(67,'Hallway','Wed Apr 29 2015 02:26:14 GMT+0200 (SAST)'),(68,'Back Beam','Fri May 01 2015 19:33:38 GMT+0200 (SAST)'),(69,'Back Beam','Fri May 01 2015 19:33:38 GMT+0200 (SAST)'),(70,'Back Beam','Sat May 02 2015 12:23:35 GMT+0200 (SAST)'),(71,'Back Beam','Sat May 02 2015 12:23:35 GMT+0200 (SAST)'),(72,'Living Room','Sat May 02 2015 12:25:47 GMT+0200 (SAST)'),(73,'Living Room','Sat May 02 2015 12:25:47 GMT+0200 (SAST)'),(74,'Driveway','Sun May 03 2015 04:16:58 GMT+0200 (SAST)'),(75,'Driveway','Sun May 03 2015 04:16:58 GMT+0200 (SAST)'),(76,'Back Beam','Sat May 09 2015 13:57:21 GMT+0200 (SAST)'),(77,'Back Beam','Sat May 09 2015 13:57:21 GMT+0200 (SAST)'),(78,'Driveway','Tue May 19 2015 16:31:28 GMT+0200 (SAST)'),(79,'Driveway','Tue May 19 2015 16:31:28 GMT+0200 (SAST)'),(80,'Main Bedroom','Wed May 20 2015 07:04:24 GMT+0200 (SAST)'),(81,'Main Bedroom','Wed May 20 2015 07:04:24 GMT+0200 (SAST)'),(82,'AwayArm','Wed May 20 2015 07:04:32 GMT+0200 (SAST)'),(83,'AwayArm','Wed May 20 2015 07:04:32 GMT+0200 (SAST)'),(84,'Driveway','Wed May 20 2015 16:06:02 GMT+0200 (SAST)'),(85,'Driveway','Wed May 20 2015 16:06:02 GMT+0200 (SAST)'),(86,'Back Beam','Wed May 20 2015 19:27:46 GMT+0200 (SAST)'),(87,'Back Beam','Wed May 20 2015 19:27:46 GMT+0200 (SAST)'),(88,'Driveway','Fri May 22 2015 15:55:13 GMT+0200 (SAST)'),(89,'Driveway','Fri May 22 2015 15:55:13 GMT+0200 (SAST)'),(90,'Back Beam','Fri May 22 2015 18:45:17 GMT+0200 (SAST)'),(91,'Back Beam','Fri May 22 2015 18:45:17 GMT+0200 (SAST)'),(92,'Driveway','Mon May 25 2015 15:59:02 GMT+0200 (SAST)'),(93,'Driveway','Mon May 25 2015 15:59:02 GMT+0200 (SAST)'),(94,'AwayArm','Mon May 25 2015 15:59:15 GMT+0200 (SAST)'),(95,'AwayArm','Mon May 25 2015 15:59:15 GMT+0200 (SAST)'),(96,'Front Beam','Sat May 30 2015 06:54:11 GMT+0200 (SAST)'),(97,'Front Beam','Sat May 30 2015 06:54:11 GMT+0200 (SAST)'),(98,'Front Beam','Thu Jun 04 2015 13:04:06 GMT+0200 (SAST)'),(99,'Front Beam','Thu Jun 04 2015 13:04:06 GMT+0200 (SAST)'),(100,'Back Beam','Sun Jun 07 2015 19:45:53 GMT+0200 (SAST)'),(101,'Back Beam','Sun Jun 07 2015 19:45:53 GMT+0200 (SAST)'),(102,'Living Room','Fri Jun 19 2015 01:18:20 GMT+0200 (SAST)'),(103,'Living Room','Fri Jun 19 2015 01:18:20 GMT+0200 (SAST)'),(104,'AwayArm','Fri Jun 19 2015 01:19:05 GMT+0200 (SAST)'),(105,'AwayArm','Fri Jun 19 2015 01:19:05 GMT+0200 (SAST)'),(106,'Pool Beam','Sun Jun 21 2015 16:53:24 GMT+0200 (SAST)'),(107,'Pool Beam','Sun Jun 21 2015 16:53:24 GMT+0200 (SAST)'),(108,'AwayArm','Mon Jun 22 2015 16:15:46 GMT+0200 (SAST)'),(109,'AwayArm','Mon Jun 22 2015 16:15:46 GMT+0200 (SAST)'),(110,'Pool Beam','Tue Jun 23 2015 11:55:10 GMT+0200 (SAST)'),(111,'Pool Beam','Tue Jun 23 2015 11:55:10 GMT+0200 (SAST)'),(112,'Driveway','Tue Jun 23 2015 20:18:05 GMT+0200 (SAST)'),(113,'Driveway','Tue Jun 23 2015 20:18:05 GMT+0200 (SAST)'),(114,'AwayArm','Tue Jun 23 2015 20:18:09 GMT+0200 (SAST)'),(115,'AwayArm','Tue Jun 23 2015 20:18:09 GMT+0200 (SAST)'),(116,'Back Beam','Thu Jun 25 2015 17:04:46 GMT+0200 (SAST)'),(117,'Back Beam','Thu Jun 25 2015 17:04:46 GMT+0200 (SAST)'),(118,'Back Beam','Thu Jun 25 2015 17:04:46 GMT+0200 (SAST)'),(119,'Back Beam','Thu Jun 25 2015 17:53:22 GMT+0200 (SAST)'),(120,'Back Beam','Thu Jun 25 2015 17:53:22 GMT+0200 (SAST)'),(121,'Back Beam','Thu Jun 25 2015 17:53:22 GMT+0200 (SAST)'),(122,'Back Beam','Sat Jun 27 2015 18:19:27 GMT+0200 (SAST)'),(123,'Back Beam','Sat Jun 27 2015 18:19:28 GMT+0200 (SAST)'),(124,'Driveway','Thu Jul 02 2015 13:48:03 GMT+0200 (SAST)'),(125,'Driveway','Thu Jul 02 2015 13:48:03 GMT+0200 (SAST)'),(126,'Electric Fence','Sat Jul 04 2015 12:58:28 GMT+0200 (SAST)'),(127,'Electric Fence','Sat Jul 04 2015 12:58:28 GMT+0200 (SAST)'),(128,'Electric Fence','Sat Jul 04 2015 12:58:28 GMT+0200 (SAST)'),(129,'Electric Fence','Sat Jul 04 2015 12:58:28 GMT+0200 (SAST)'),(130,'Electric Fence','Sat Jul 04 2015 12:58:28 GMT+0200 (SAST)'),(131,'Electric Fence','Sat Jul 04 2015 12:58:28 GMT+0200 (SAST)'),(132,'Electric Fence','Sat Jul 04 2015 12:58:28 GMT+0200 (SAST)'),(133,'Electric Fence','Sat Jul 04 2015 12:58:28 GMT+0200 (SAST)'),(134,'Electric Fence','Sat Jul 04 2015 12:58:28 GMT+0200 (SAST)'),(135,'Electric Fence','Sat Jul 04 2015 12:58:41 GMT+0200 (SAST)'),(136,'Electric Fence','Sat Jul 04 2015 12:58:41 GMT+0200 (SAST)'),(137,'Electric Fence','Sat Jul 04 2015 12:58:41 GMT+0200 (SAST)'),(138,'Electric Fence','Sat Jul 04 2015 12:58:41 GMT+0200 (SAST)'),(139,'Electric Fence','Sat Jul 04 2015 12:58:41 GMT+0200 (SAST)'),(140,'Electric Fence','Sat Jul 04 2015 12:58:41 GMT+0200 (SAST)'),(141,'Electric Fence','Sat Jul 04 2015 12:58:41 GMT+0200 (SAST)'),(142,'Electric Fence','Sat Jul 04 2015 12:58:41 GMT+0200 (SAST)'),(143,'Electric Fence','Sat Jul 04 2015 12:58:41 GMT+0200 (SAST)'),(144,'Main Gate','Sat Jul 04 2015 21:07:24 GMT+0200 (SAST)'),(145,'Main Gate','Sat Jul 04 2015 21:07:24 GMT+0200 (SAST)'),(146,'Main Gate','Sat Jul 04 2015 21:07:24 GMT+0200 (SAST)'),(147,'Main Gate','Sat Jul 04 2015 21:07:24 GMT+0200 (SAST)'),(148,'Main Gate','Sat Jul 04 2015 21:07:24 GMT+0200 (SAST)'),(149,'Main Gate','Sat Jul 04 2015 21:07:24 GMT+0200 (SAST)'),(150,'Main Gate','Sat Jul 04 2015 21:07:24 GMT+0200 (SAST)'),(151,'Main Gate','Sat Jul 04 2015 21:07:24 GMT+0200 (SAST)'),(152,'Main Gate','Sat Jul 04 2015 21:07:24 GMT+0200 (SAST)'),(153,'Back Beam','Sat Jul 11 2015 09:50:46 GMT+0200 (SAST)'),(154,'Back Beam','Sat Jul 11 2015 09:50:46 GMT+0200 (SAST)'),(155,'Back Beam','Thu Jul 16 2015 18:29:17 GMT+0200 (SAST)'),(156,'Back Beam','Thu Jul 16 2015 18:29:17 GMT+0200 (SAST)'),(157,'Main Bedroom','Sat Jul 18 2015 17:51:07 GMT+0200 (SAST)'),(158,'Main Bedroom','Sat Jul 18 2015 17:51:07 GMT+0200 (SAST)'),(159,'Back Beam','Sun Jul 19 2015 21:19:47 GMT+0200 (SAST)'),(160,'Back Beam','Sun Jul 19 2015 21:19:47 GMT+0200 (SAST)'),(161,'Back Beam','Sun Jul 19 2015 23:51:34 GMT+0200 (SAST)'),(162,'Back Beam','Sun Jul 19 2015 23:51:34 GMT+0200 (SAST)'),(163,'Electric Fence','Wed Jul 22 2015 17:30:40 GMT+0200 (SAST)'),(164,'Electric Fence','Wed Jul 22 2015 17:30:40 GMT+0200 (SAST)'),(165,'Electric Fence','Wed Jul 22 2015 17:31:49 GMT+0200 (SAST)'),(166,'Electric Fence','Wed Jul 22 2015 17:31:49 GMT+0200 (SAST)'),(167,'Electric Fence','Wed Jul 22 2015 17:32:18 GMT+0200 (SAST)'),(168,'Electric Fence','Wed Jul 22 2015 17:32:18 GMT+0200 (SAST)'),(169,'Back Beam','Sat Jul 25 2015 15:46:43 GMT+0200 (SAST)'),(170,'Back Beam','Sat Jul 25 2015 15:46:43 GMT+0200 (SAST)'),(171,'Living Room','Thu Aug 06 2015 01:45:23 GMT+0200 (SAST)'),(172,'Living Room','Thu Aug 06 2015 01:45:23 GMT+0200 (SAST)'),(173,'Right Garage Door','Thu Aug 06 2015 12:00:08 GMT+0200 (SAST)'),(174,'Right Garage Door','Thu Aug 06 2015 12:00:08 GMT+0200 (SAST)'),(175,'Pool Beam','Thu Aug 13 2015 11:30:14 GMT+0200 (SAST)'),(176,'Pool Beam','Thu Aug 13 2015 11:30:14 GMT+0200 (SAST)'),(177,'Back Beam','Sat Aug 15 2015 11:02:43 GMT+0200 (SAST)'),(178,'Back Beam','Sat Aug 15 2015 11:02:43 GMT+0200 (SAST)'),(179,'Front Beam','Tue Aug 25 2015 18:43:04 GMT+0200 (SAST)'),(180,'Front Beam','Tue Aug 25 2015 18:43:04 GMT+0200 (SAST)'),(181,'Pool Beam','Sat Aug 29 2015 22:35:57 GMT+0200 (SAST)'),(182,'Pool Beam','Sat Aug 29 2015 22:35:57 GMT+0200 (SAST)'),(183,'Pool Beam','Tue Sep 01 2015 12:01:21 GMT+0200 (SAST)'),(184,'Pool Beam','Tue Sep 01 2015 12:01:21 GMT+0200 (SAST)'),(185,'Office','Tue Sep 01 2015 21:33:26 GMT+0200 (SAST)'),(186,'Office','Tue Sep 01 2015 21:33:26 GMT+0200 (SAST)'),(187,'Back Beam','Sat Sep 12 2015 07:38:38 GMT+0200 (SAST)'),(188,'Back Beam','Sat Sep 12 2015 07:38:38 GMT+0200 (SAST)'),(189,'Back Beam','Sat Sep 12 2015 19:38:27 GMT+0200 (SAST)'),(190,'Back Beam','Sat Sep 12 2015 19:38:27 GMT+0200 (SAST)'),(191,'Lapa','Wed Sep 16 2015 15:46:08 GMT+0200 (SAST)'),(192,'Lapa','Wed Sep 16 2015 15:46:08 GMT+0200 (SAST)'),(193,'Back Beam','Thu Sep 17 2015 13:27:36 GMT+0200 (SAST)'),(194,'Back Beam','Thu Sep 17 2015 13:27:36 GMT+0200 (SAST)'),(195,'Back Beam','Thu Sep 17 2015 13:32:14 GMT+0200 (SAST)'),(196,'Back Beam','Thu Sep 17 2015 13:32:14 GMT+0200 (SAST)'),(197,'Lapa','Thu Sep 17 2015 15:31:08 GMT+0200 (SAST)'),(198,'Lapa','Thu Sep 17 2015 15:31:08 GMT+0200 (SAST)'),(199,'Back Beam','Sat Sep 19 2015 09:32:29 GMT+0200 (SAST)'),(200,'Back Beam','Sat Sep 19 2015 09:32:29 GMT+0200 (SAST)'),(201,'Front Beam','Sun Sep 20 2015 10:45:08 GMT+0200 (SAST)'),(202,'Front Beam','Sun Sep 20 2015 10:45:08 GMT+0200 (SAST)'),(203,'Laundry','Mon Sep 28 2015 19:26:53 GMT+0200 (SAST)'),(204,'Laundry','Mon Sep 28 2015 19:26:53 GMT+0200 (SAST)'),(205,'Side Beam','Mon Sep 28 2015 20:13:02 GMT+0200 (SAST)'),(206,'Side Beam','Mon Sep 28 2015 20:13:06 GMT+0200 (SAST)'),(207,'Side Beam','Mon Sep 28 2015 20:13:42 GMT+0200 (SAST)'),(208,'Lapa','Tue Sep 29 2015 20:24:10 GMT+0200 (SAST)'),(209,'Pool Beam','Thu Oct 01 2015 10:25:41 GMT+0200 (SAST)'),(210,'Front Beam','Thu Oct 01 2015 13:36:31 GMT+0200 (SAST)'),(211,'Pool Beam','Sat Oct 03 2015 09:00:30 GMT+0200 (SAST)'),(212,'Electric Fence','Sun Oct 04 2015 14:55:33 GMT+0200 (SAST)'),(213,'Office','Tue Oct 06 2015 16:04:37 GMT+0200 (SAST)'),(214,'Lapa','Thu Oct 08 2015 14:22:00 GMT+0200 (SAST)'),(215,'Back Beam','Thu Oct 08 2015 14:36:11 GMT+0200 (SAST)'),(216,'Driveway','Sat Oct 10 2015 17:14:47 GMT+0200 (SAST)'),(217,'Driveway','Sat Oct 10 2015 17:14:47 GMT+0200 (SAST)'),(218,'Driveway','Sat Oct 10 2015 17:14:47 GMT+0200 (SAST)'),(219,'Driveway','Sat Oct 10 2015 17:14:47 GMT+0200 (SAST)'),(220,'Driveway','Sat Oct 10 2015 17:14:47 GMT+0200 (SAST)'),(221,'Pool Beam','Mon Oct 12 2015 15:10:01 GMT+0200 (SAST)'),(222,'Back Beam','Sun Oct 18 2015 09:39:35 GMT+0200 (SAST)'),(223,'Pool Beam','Sun Oct 18 2015 13:03:07 GMT+0200 (SAST)'),(224,'Back Beam','Sat Oct 24 2015 18:00:52 GMT+0200 (SAST)'),(225,'Electric Fence','Tue Oct 27 2015 08:07:20 GMT+0200 (SAST)'),(226,'Electric Fence','Tue Oct 27 2015 08:19:22 GMT+0200 (SAST)'),(227,'Electric Fence','Tue Oct 27 2015 08:19:45 GMT+0200 (SAST)'),(228,'Back Beam','Thu Oct 29 2015 09:28:20 GMT+0200 (SAST)'),(229,'Electric Fence','Sat Oct 31 2015 17:44:26 GMT+0200 (SAST)'),(230,'Electric Fence','Sun Nov 01 2015 14:44:10 GMT+0200 (SAST)'),(231,'Lapa Beam','Fri Nov 06 2015 10:10:55 GMT+0200 (SAST)'),(232,'Lapa Beam','Fri Nov 06 2015 10:11:16 GMT+0200 (SAST)'),(233,'Office Door','Fri Nov 06 2015 23:02:00 GMT+0200 (SAST)'),(234,'Electric Fence','Sat Nov 07 2015 05:26:00 GMT+0200 (SAST)'),(235,'Main Gate','Sat Nov 07 2015 07:38:03 GMT+0200 (SAST)'),(236,'Main Gate','Sat Nov 07 2015 07:38:22 GMT+0200 (SAST)'),(237,'Back Beam','Sat Nov 07 2015 18:43:15 GMT+0200 (SAST)'),(238,'Back Beam','Mon Nov 09 2015 18:38:35 GMT+0200 (SAST)'),(239,'Back Beam','Thu Nov 12 2015 07:43:39 GMT+0200 (SAST)'),(240,'Back Beam','Thu Nov 12 2015 07:43:46 GMT+0200 (SAST)'),(241,'Main Bedroom','Thu Nov 19 2015 22:30:43 GMT+0200 (SAST)'),(242,'Side Beam','Fri Nov 20 2015 23:00:01 GMT+0200 (SAST)'),(243,'Pool Beam','Sat Nov 21 2015 15:09:59 GMT+0200 (SAST)'),(244,'Electric Fence','Sat Nov 21 2015 22:36:10 GMT+0200 (SAST)'),(245,'Back Beam','Tue Nov 24 2015 10:21:58 GMT+0200 (SAST)'),(246,'Lapa','Tue Nov 24 2015 15:50:45 GMT+0200 (SAST)'),(247,'Front Beam','Thu Nov 26 2015 13:37:06 GMT+0200 (SAST)'),(248,'Pool Beam','Thu Nov 26 2015 15:18:49 GMT+0200 (SAST)'),(249,'Lapa','Thu Nov 26 2015 15:47:29 GMT+0200 (SAST)'),(250,'Pool Beam','Thu Nov 26 2015 15:54:24 GMT+0200 (SAST)'),(251,'Electric Fence','Thu Nov 26 2015 18:55:39 GMT+0200 (SAST)'),(252,'Back Beam','Fri Nov 27 2015 17:38:08 GMT+0200 (SAST)'),(253,'Back Beam','Fri Nov 27 2015 18:27:54 GMT+0200 (SAST)'),(254,'Lapa Beam','Tue Dec 01 2015 10:22:59 GMT+0200 (SAST)'),(255,'Main Gate','Sun Dec 06 2015 13:19:08 GMT+0200 (SAST)'),(256,'Front Beam','Wed Dec 16 2015 20:29:06 GMT+0200 (SAST)'),(257,'Electric Fence','Thu Dec 17 2015 12:09:23 GMT+0200 (SAST)'),(258,'Lapa','Fri Dec 18 2015 16:11:37 GMT+0200 (SAST)'),(259,'Lapa','Fri Dec 18 2015 16:28:22 GMT+0200 (SAST)'),(260,'Lapa','Sat Dec 19 2015 15:08:04 GMT+0200 (SAST)'),(261,'Lapa','Mon Dec 21 2015 13:11:48 GMT+0200 (SAST)'),(262,'Lapa','Mon Dec 21 2015 16:28:37 GMT+0200 (SAST)'),(263,'Pool Beam','Mon Dec 21 2015 16:33:32 GMT+0200 (SAST)'),(264,'Lapa Beam','Mon Dec 21 2015 16:39:16 GMT+0200 (SAST)'),(265,'Electric Fence','Mon Dec 21 2015 16:46:04 GMT+0200 (SAST)'),(266,'Side Beam','Mon Dec 21 2015 16:49:31 GMT+0200 (SAST)'),(267,'Pool Beam','Wed Dec 23 2015 15:54:57 GMT+0200 (SAST)'),(268,'Pool Beam','Sat Dec 26 2015 15:09:09 GMT+0200 (SAST)'),(269,'Side Beam','Sat Dec 26 2015 16:47:47 GMT+0200 (SAST)'),(270,'Side Beam','Sun Dec 27 2015 11:36:37 GMT+0200 (SAST)'),(271,'Side Beam','Sun Dec 27 2015 13:31:59 GMT+0200 (SAST)'),(272,'Side Beam','Mon Dec 28 2015 11:56:29 GMT+0200 (SAST)'),(273,'Electric Fence','Fri Jan 01 2016 10:33:34 GMT+0200 (SAST)'),(274,'Front Beam','Sat Jan 02 2016 09:10:10 GMT+0200 (SAST)'),(275,'Pool Beam','Sun Jan 03 2016 08:22:39 GMT+0200 (SAST)'),(276,'Main Gate','Tue Jan 05 2016 06:03:37 GMT+0200 (SAST)'),(277,'Main Gate','Tue Jan 05 2016 06:03:56 GMT+0200 (SAST)'),(278,'Electric Fence','Wed Jan 06 2016 11:25:46 GMT+0200 (SAST)'),(279,'Driveway','Wed Jan 06 2016 16:39:34 GMT+0200 (SAST)'),(280,'Office','Sun Jan 10 2016 23:43:10 GMT+0200 (SAST)'),(281,'Front Beam','Sat Jan 16 2016 05:54:02 GMT+0200 (SAST)'),(282,'Lapa Beam','Sun Jan 24 2016 01:28:40 GMT+0200 (SAST)'),(283,'Main Gate','Sat Jan 30 2016 17:52:38 GMT+0200 (SAST)'),(284,'Main Gate','Sat Jan 30 2016 17:52:38 GMT+0200 (SAST)'),(285,'Back Beam','Sun Jan 31 2016 11:23:00 GMT+0200 (SAST)'),(286,'Back Beam','Sun Jan 31 2016 11:23:00 GMT+0200 (SAST)'),(287,'Pool Beam','Tue Feb 02 2016 15:12:21 GMT+0200 (SAST)'),(288,'Pool Beam','Tue Feb 02 2016 15:12:21 GMT+0200 (SAST)'),(289,'Back Beam','Sat Feb 06 2016 16:34:16 GMT+0200 (SAST)'),(290,'Back Beam','Sat Feb 06 2016 16:34:17 GMT+0200 (SAST)'),(291,'Back Beam','Sat Feb 06 2016 18:21:06 GMT+0200 (SAST)'),(292,'Back Beam','Sat Feb 06 2016 18:21:06 GMT+0200 (SAST)'),(293,'Front Beam','Fri Feb 12 2016 07:00:27 GMT+0200 (SAST)'),(294,'Front Beam','Fri Feb 12 2016 07:00:27 GMT+0200 (SAST)'),(295,'Back Beam','Sat Feb 13 2016 11:13:27 GMT+0200 (SAST)'),(296,'Back Beam','Sat Feb 13 2016 11:13:27 GMT+0200 (SAST)'),(297,'Back Beam','Tue Feb 16 2016 11:05:30 GMT+0200 (SAST)'),(298,'Back Beam','Tue Feb 16 2016 11:05:30 GMT+0200 (SAST)'),(299,'Driveway','Wed Feb 17 2016 16:56:29 GMT+0200 (SAST)'),(300,'Driveway','Wed Feb 17 2016 16:56:29 GMT+0200 (SAST)'),(301,'Back Beam','Wed Feb 17 2016 17:00:18 GMT+0200 (SAST)'),(302,'Back Beam','Wed Feb 17 2016 17:00:18 GMT+0200 (SAST)'),(303,'Back Beam','Sun Feb 21 2016 08:58:02 GMT+0200 (SAST)'),(304,'Back Beam','Sun Feb 21 2016 08:58:02 GMT+0200 (SAST)'),(305,'Back Beam','Thu Feb 25 2016 13:33:48 GMT+0200 (SAST)'),(306,'Back Beam','Thu Feb 25 2016 13:34:49 GMT+0200 (SAST)'),(307,'Main Gate','Sun Feb 28 2016 12:05:14 GMT+0200 (SAST)'),(308,'Back Beam','Sat Mar 05 2016 09:53:08 GMT+0200 (SAST)'),(309,'Main Gate','Mon Mar 14 2016 16:10:23 GMT+0200 (SAST)'),(310,'Main Gate','Mon Mar 14 2016 16:10:23 GMT+0200 (SAST)'),(311,'Electric Fence','Thu Mar 17 2016 09:36:06 GMT+0200 (SAST)'),(312,'Electric Fence','Thu Mar 17 2016 09:38:00 GMT+0200 (SAST)'),(313,'Living Room','Sun Mar 20 2016 16:03:29 GMT+0200 (SAST)'),(314,'Living Room','Sun Mar 20 2016 16:04:28 GMT+0200 (SAST)'),(315,'Driveway','Tue Mar 22 2016 13:37:59 GMT+0200 (SAST)'),(316,'Electric Fence','Wed Mar 23 2016 10:59:02 GMT+0200 (SAST)'),(317,'Pool Beam','Fri Mar 25 2016 12:01:46 GMT+0200 (SAST)'),(318,'Driveway','Fri Mar 25 2016 21:21:23 GMT+0200 (SAST)'),(319,'Back Beam','Sun Mar 27 2016 10:11:17 GMT+0200 (SAST)'),(320,'Back Beam','Sun Mar 27 2016 10:11:17 GMT+0200 (SAST)'),(321,'Back Beam','Sun Mar 27 2016 10:31:27 GMT+0200 (SAST)'),(322,'Back Beam','Sun Mar 27 2016 10:31:28 GMT+0200 (SAST)'),(323,'Main Gate','Tue Mar 29 2016 15:11:45 GMT+0200 (SAST)'),(324,'Main Gate','Tue Mar 29 2016 15:11:46 GMT+0200 (SAST)'),(325,'Back Beam','Thu Mar 31 2016 14:59:19 GMT+0200 (SAST)'),(326,'Main Gate','Sat Apr 02 2016 12:28:37 GMT+0200 (SAST)'),(327,'Driveway','Sat Apr 02 2016 12:30:19 GMT+0200 (SAST)'),(328,'Lapa Beam','Thu Apr 07 2016 15:19:53 GMT+0200 (SAST)'),(329,'AwayArm','Tue Apr 12 2016 20:44:41 GMT+0200 (SAST)'),(330,'Back Beam','Sat Apr 16 2016 16:05:36 GMT+0200 (SAST)'),(331,'Main Gate','Mon Apr 18 2016 05:39:56 GMT+0200 (SAST)'),(332,'Main Gate','Mon Apr 18 2016 05:39:56 GMT+0200 (SAST)'),(333,'Lapa','Mon Apr 18 2016 16:10:24 GMT+0200 (SAST)'),(334,'Lapa','Mon Apr 18 2016 16:10:24 GMT+0200 (SAST)'),(335,'Main Gate','Tue Apr 19 2016 07:39:30 GMT+0200 (SAST)'),(336,'Driveway','Tue Apr 19 2016 07:39:42 GMT+0200 (SAST)'),(337,'Main Gate','Tue Apr 19 2016 07:41:25 GMT+0200 (SAST)'),(338,'Office Door','Thu Apr 21 2016 05:33:12 GMT+0200 (SAST)'),(339,'Side Beam','Thu Apr 21 2016 08:55:58 GMT+0200 (SAST)'),(340,'Side Beam','Thu Apr 21 2016 10:43:52 GMT+0200 (SAST)'),(341,'Living Room','Thu Apr 21 2016 12:05:53 GMT+0200 (SAST)');
/*!40000 ALTER TABLE `Alarm_Triggers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Event_Log`
--

DROP TABLE IF EXISTS `Event_Log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Event_Log` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(100) NOT NULL,
  `Event` varchar(100) NOT NULL,
  `Time` varchar(100) NOT NULL,
  `TimeStamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1372786 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Event_Log`
--

LOCK TABLES `Event_Log` WRITE;
/*!40000 ALTER TABLE `Event_Log` DISABLE KEYS */;
INSERT INTO `Event_Log` VALUES (1372784,'Power','{\"node\":\"28\",\"port\":\"0\",\"value\":\"4.70\"}','Wed Apr 27 2016 21:24:12 GMT+0200 (SAST)','2016-04-27 19:24:12'),(1372785,'Power','{\"node\":\"28\",\"port\":\"0\",\"value\":\"4.29\"}','Wed Apr 27 2016 21:25:22 GMT+0200 (SAST)','2016-04-27 19:25:22');
/*!40000 ALTER TABLE `Event_Log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Item_Types`
--

DROP TABLE IF EXISTS `Item_Types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Item_Types` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(45) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  UNIQUE KEY `Type_UNIQUE` (`Type`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Item_Types`
--

LOCK TABLES `Item_Types` WRITE;
/*!40000 ALTER TABLE `Item_Types` DISABLE KEYS */;
INSERT INTO `Item_Types` VALUES (5,'Access'),(1,'Appliance'),(13,'Dark'),(12,'Door'),(9,'Humidity'),(2,'Indoor Light'),(6,'Irrigation'),(7,'Motion'),(3,'Outdoor Light'),(10,'Power'),(19,'RainRate'),(17,'Remote_Sense'),(4,'Security Light'),(8,'Temperature'),(14,'Time'),(15,'Virtual'),(18,'Virtual Alarm'),(11,'Voltage'),(16,'Weather');
/*!40000 ALTER TABLE `Item_Types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Items`
--

DROP TABLE IF EXISTS `Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Items` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Item_Name` varchar(45) NOT NULL,
  `Item_Type` int(11) NOT NULL,
  `Item_Sort_Position` int(8) DEFAULT NULL,
  `Node_Id` int(11) DEFAULT NULL,
  `Node_Port` int(11) DEFAULT NULL,
  `Item_IsVirtual` tinyint(1) NOT NULL DEFAULT '0',
  `Item_Location` int(11) DEFAULT NULL,
  `Item_Current_Value` double DEFAULT NULL,
  `Item_Default_Value` int(11) DEFAULT NULL,
  `Item_Is_Toggle` tinyint(1) DEFAULT NULL,
  `Item_Toggle_Delay` int(11) DEFAULT '1',
  `Item_Enabled_Value` int(11) DEFAULT NULL,
  `Item_Current_State` int(11) DEFAULT NULL,
  `Network_Address` varchar(20) DEFAULT NULL,
  `Time_Updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Items`
--

LOCK TABLES `Items` WRITE;
/*!40000 ALTER TABLE `Items` DISABLE KEYS */;
INSERT INTO `Items` VALUES (101,'Test',1,9,20,1,0,1,1,0,0,NULL,1,0,NULL,'2016-04-26 18:20:12'),(102,'Test 2',6,10,20,2,0,1,1,0,1,2,1,0,NULL,'2016-04-25 04:54:58'),(103,'Electric Fence',1,2,27,1,0,2,0,0,0,0,0,0,NULL,'2016-04-23 13:46:55'),(104,'Left Garage Door Opener',5,2,27,2,0,2,0,0,1,1,1,0,NULL,'2016-04-23 13:46:49'),(105,'Right Garage Door Opener',5,3,27,3,0,2,0,0,1,1,1,0,NULL,'0000-00-00 00:00:00'),(106,'Garage Light',1,1,27,5,0,2,0,0,0,0,1,0,NULL,'2016-04-27 18:36:30'),(107,'Irrigation Back Wall',6,6,29,2,0,3,0,0,1,600,1,0,NULL,'0000-00-00 00:00:00'),(108,'Irrigation Back Grass',6,7,29,1,0,3,0,0,1,600,1,0,NULL,'2016-04-25 04:12:05'),(109,'Garage',7,1,27,6,0,2,0,0,0,0,1,0,NULL,'2016-04-27 18:33:38'),(110,'Is_Dark',13,1,NULL,NULL,1,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,'2016-04-27 19:04:28'),(111,'Current_Time',14,1,NULL,NULL,1,NULL,1461785340454,NULL,NULL,1,NULL,NULL,NULL,'2016-04-27 19:29:00'),(112,'Current_Day_Minutes',14,1,NULL,NULL,1,NULL,1289,NULL,NULL,1,NULL,NULL,NULL,'2016-04-27 19:29:00'),(113,'Day_Of_Week',14,1,NULL,NULL,1,NULL,4,NULL,NULL,1,NULL,NULL,NULL,'2014-04-24 05:12:22'),(114,'Irrigation Front Grass 1',6,1,26,3,0,4,0,0,1,1800,1,0,NULL,'2016-04-26 02:33:24'),(115,'Irrigation Front Grass 2',6,2,26,6,0,4,0,0,1,1800,1,0,NULL,'0000-00-00 00:00:00'),(116,'Irrigation Front Window',6,3,26,4,0,4,0,0,1,900,1,0,NULL,'2016-04-24 22:11:21'),(117,'Irrigation Pool',6,4,26,5,0,4,0,0,1,900,1,0,NULL,'2016-04-25 19:51:40'),(118,'Irrigation Bedrooms',6,5,26,2,0,4,0,0,1,900,1,0,NULL,'2016-04-25 03:47:05'),(119,'Pool Filler',6,8,26,1,0,4,0,0,1,1800,1,0,NULL,'2016-04-25 22:06:01'),(120,'Irrigation Master Arm',15,0,NULL,NULL,1,4,0,1,0,1,1,0,NULL,'2016-04-26 13:49:16'),(121,'Wind Speed',16,1,NULL,NULL,1,NULL,5,NULL,NULL,0,NULL,NULL,NULL,'2016-04-27 18:32:11'),(122,'Rain',19,3,20,3,0,1,0,NULL,0,0,1,0,NULL,'2016-04-24 12:13:20'),(123,'Gate Access',5,1,24,1,0,2,0,NULL,1,1,1,0,NULL,'2016-04-23 08:30:47'),(124,'Gate Remote',7,2,24,2,0,2,1,NULL,NULL,1,1,0,NULL,'2016-04-27 15:07:22'),(125,'Was_Hot',16,10,NULL,NULL,1,NULL,0,0,NULL,1,1,0,NULL,'2016-04-23 22:00:17'),(126,'Temperature',16,2,NULL,NULL,1,NULL,19.15,0,NULL,1,NULL,NULL,NULL,'2016-04-27 18:32:11'),(128,'Main Power Cons',10,1,28,0,0,2,4.29,NULL,NULL,1,NULL,NULL,NULL,'2016-04-27 19:25:22'),(129,'Geyser Power Cons',10,2,28,1,0,2,0.16,NULL,NULL,1,NULL,NULL,NULL,'2016-04-27 18:57:19'),(130,'Driveway Secure Arm',18,1,NULL,NULL,1,1,0,0,0,1,1,0,NULL,'2016-04-25 04:08:02'),(131,'Auto Pool Fill',15,2,NULL,NULL,1,4,0,1,0,1,1,0,NULL,'2016-04-26 13:49:17');
/*!40000 ALTER TABLE `Items` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`CleoUser`@`localhost`*/ /*!50003 TRIGGER Catch_Motion_Event AFTER UPDATE ON Items  FOR EACH ROW  
begin
IF NEW.Item_Type = 7 THEN
INSERT INTO Event_Log SET Type = "Motion", Event = concat("{""Zone"":""",New.Item_Name,""",""Current_State"":""",New.Item_Current_Value,"""}"),Time = NOW(); END IF; END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Nodes`
--

DROP TABLE IF EXISTS `Nodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Nodes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) DEFAULT NULL,
  `Last_Seen` double DEFAULT NULL,
  `Node_Sort_Position` int(11) DEFAULT NULL,
  `Node_Port` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  UNIQUE KEY `Name_UNIQUE` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Nodes`
--

LOCK TABLES `Nodes` WRITE;
/*!40000 ALTER TABLE `Nodes` DISABLE KEYS */;
INSERT INTO `Nodes` VALUES (1,'Irrigation Front',1461785216651,3,26),(2,'Irrigation Back',1461785290062,4,29),(3,'Test Node 1',1461785327840,5,20),(4,'Garage',1461785270117,2,27),(5,'Gate',1461785219373,1,24),(6,'DB Board',1461785122326,6,28);
/*!40000 ALTER TABLE `Nodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rule_Items`
--

DROP TABLE IF EXISTS `Rule_Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Rule_Items` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Second_Id` int(11) NOT NULL,
  `Rule_Id` varchar(100) DEFAULT NULL,
  `Item_Id` int(11) NOT NULL,
  `Equals` int(11) DEFAULT NULL,
  `Greater_Than` int(11) DEFAULT NULL,
  `Less_Than` int(11) DEFAULT NULL,
  `Not_Equal` int(11) DEFAULT NULL,
  `Secondary_Item` tinyint(1) NOT NULL DEFAULT '0',
  `Status` tinyint(1) DEFAULT NULL,
  `Comments` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rule_Items`
--

LOCK TABLES `Rule_Items` WRITE;
/*!40000 ALTER TABLE `Rule_Items` DISABLE KEYS */;
INSERT INTO `Rule_Items` VALUES (1,1,'1',109,1,NULL,NULL,NULL,0,0,'Is motion in garage'),(2,2,'19',122,1,NULL,NULL,NULL,0,0,'Test motion test relay'),(4,4,'2',110,0,NULL,NULL,NULL,0,1,'Is not dark'),(5,5,'3',112,1389,NULL,NULL,NULL,0,0,'Time = 23h09'),(8,8,'6;34;38',28,6,NULL,NULL,NULL,0,0,'Check alarm arm status for relay and LED'),(10,10,'6',28,8,NULL,NULL,NULL,0,0,'Check alarm arm status for relay and LED'),(11,11,'6',28,9,NULL,NULL,NULL,0,0,'Check alarm arm status for relay and LED'),(12,12,'6;33;34',30,1,NULL,NULL,NULL,0,0,'Check alarm arm status for relay and LED'),(14,14,'6;34;38',28,13,NULL,NULL,NULL,0,0,'Check alarm arm status for relay and LED'),(17,17,'7',28,11,NULL,NULL,NULL,0,0,'Check alarm disarm status for relay and LED'),(18,18,'14;15;16;17',113,0,NULL,NULL,NULL,0,0,'day = Sunday'),(19,19,'12',113,1,NULL,NULL,NULL,0,0,'day = Monday'),(21,21,'',113,2,NULL,NULL,NULL,0,0,'day = Tuesday'),(22,22,'12;13;18',113,3,NULL,NULL,NULL,0,0,'day = Wednesday'),(24,24,'14;15;16;17',113,4,NULL,NULL,NULL,0,1,'day = Thurday'),(25,25,'',113,5,NULL,NULL,NULL,0,0,'day = Friday'),(26,26,'13;18',113,6,NULL,NULL,NULL,0,0,'day = Saturday'),(27,27,'13;14',112,300,NULL,NULL,NULL,0,0,'time = 05h00'),(28,28,'15',112,316,NULL,NULL,NULL,0,0,'time = 05h16'),(29,29,'0',112,331,NULL,NULL,NULL,0,0,'time = 05h31'),(30,30,'16',112,332,NULL,NULL,NULL,0,0,'time = 05h32'),(31,31,'17',112,348,NULL,NULL,NULL,0,0,'time = 05h48'),(32,32,'',112,360,NULL,NULL,NULL,0,0,'time = 06h00'),(33,33,'12;13;14;15;16;17;18;30',120,1,NULL,NULL,NULL,0,0,'Irrigation Master Arm = 1'),(34,34,'9;25',120,0,NULL,NULL,NULL,0,1,'Irrigation Master Arm = 0'),(35,35,'18',112,362,NULL,NULL,NULL,0,0,'time = 06h02'),(36,36,NULL,0,NULL,9,NULL,NULL,0,0,'Wind Speed > 10m/s'),(37,37,'12;13;14;15;16;17;18',121,NULL,NULL,10,NULL,0,1,'Wind Speed <= 10m/s'),(38,38,'0',106,0,NULL,NULL,NULL,0,1,'Garage light is Off - not used'),(39,39,'1;44',19,1,NULL,NULL,NULL,0,0,'Left garage door open'),(40,40,'1;44',20,1,NULL,NULL,NULL,0,0,'Right Garage door open'),(41,41,'20;26;29;47',17,1,NULL,NULL,NULL,0,0,'Gate is opened'),(42,42,'20;29',124,NULL,NULL,NULL,0,0,1,'Gate remote is not triggered'),(43,43,'21',126,NULL,29,NULL,NULL,0,0,'Temperature was above 29'),(44,44,'22',112,0,NULL,NULL,NULL,0,0,'Is Midnight'),(45,45,'23',112,1080,NULL,NULL,NULL,0,0,'time = 18h00'),(46,46,'24',112,1091,NULL,NULL,NULL,0,0,'time = 18h11'),(66,3,'19',110,1,NULL,NULL,NULL,0,0,'Is Dark'),(78,47,'23;24',125,1,NULL,NULL,NULL,0,0,'Is Hot'),(109,48,'12',112,240,NULL,NULL,NULL,0,0,'time = 04h00'),(110,49,'25;28;32',112,900,NULL,NULL,NULL,0,0,'time = 15h00'),(114,53,'27',7,1,NULL,NULL,NULL,0,0,'Office zone'),(115,54,'28',103,1,NULL,NULL,NULL,0,0,'Electric fence off '),(117,55,'31',112,1,NULL,NULL,NULL,0,0,'Pool fill auto, current time 1 minute'),(118,56,'31',131,1,NULL,NULL,NULL,0,0,'Pool fill auto'),(119,57,'32',131,0,NULL,NULL,NULL,1,1,'Pool fill is off'),(121,58,'33',26,1,NULL,NULL,NULL,0,0,'Back beam alarm in night mode'),(122,59,'34;36',15,1,NULL,NULL,NULL,0,0,'Alarm Disarm'),(125,62,'34',28,12,NULL,NULL,NULL,0,0,'Alarm Disarm - main partition'),(127,64,'35',8,1,NULL,NULL,NULL,0,0,'Office test'),(128,65,'6;34;38',28,7,NULL,NULL,NULL,0,1,'Check alarm arm status for relay and LED'),(129,66,'34',28,14,NULL,NULL,NULL,0,0,'Exit delay'),(130,67,'36;37',28,3,NULL,NULL,NULL,0,0,'Alarm Ready'),(131,68,'36;37',28,5,NULL,NULL,NULL,0,0,'Alarm Ready force arm'),(132,69,'37;38',16,1,NULL,NULL,NULL,0,0,'Stay button'),(142,70,'47',130,1,NULL,NULL,NULL,0,0,''),(144,72,'47',18,1,NULL,NULL,NULL,0,0,'');
/*!40000 ALTER TABLE `Rule_Items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rules`
--

DROP TABLE IF EXISTS `Rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Rules` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Conditions` varchar(75) NOT NULL,
  `Result` varchar(45) NOT NULL,
  `RuleOnTIme` int(11) NOT NULL DEFAULT '0',
  `Rule_Enabled` tinyint(1) NOT NULL DEFAULT '1',
  `FunctionName` varchar(45) DEFAULT NULL,
  `Comments` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rules`
--

LOCK TABLES `Rules` WRITE;
/*!40000 ALTER TABLE `Rules` DISABLE KEYS */;
INSERT INTO `Rules` VALUES (1,'1;+;39;+;40','106;=;1',180,1,NULL,'If is motion in garage and garage light is off, switch on light or if a doo'),(2,'','106;=;0',0,0,NULL,'If  is not dark switch off garage light'),(3,'5','102;=;1',0,1,NULL,'If time is bigger test'),(6,'8;+;65;+;10;+;11;+;12;+;14','101;=;1',0,1,NULL,'Alarm armed test'),(7,'17','101;=;0',0,1,NULL,'Alarm Disarm Test'),(9,'34','107;=;0;108;=;0;101;=;0',0,0,NULL,'Switch off all Irrigation with Master Arm'),(12,'22;*;33;*;48;*;37;+;19;*;33;*;48;*;37','114;=;2000',0,1,NULL,'Switch Frontgrass one irrigation on wednesdays and Mondays at 04h00 for 60'),(13,'22;*;33;*;27;*;37;+;26;*;33;*;27;*;37','115;=;2000',0,1,NULL,'Switch Frontgrass two irrigation on wednesday and saturdays  05h00 for 60 m'),(14,'24;*;33;*;27;*;37;+;18;*;33;*;27;*;37','116;=;900',0,1,NULL,'Switch Irrigation Front Window on on Thursday and sunday at 05h00 for 15 mi'),(15,'24;*;33;*;28;*;37;+;18;*;33;*;28;*;37','117;=;900',0,1,NULL,'Switch Irrigation Pool on Thursday  and sunday at 05h16 for 15 min'),(16,'24;*;33;*;30;*;37;+;18;*;33;*;30;*;37','118;=;900',0,1,NULL,'Switch on irrigation Bedroom window on thursday and sunday at 05h32 for 15 '),(17,'24;*;33;*;31;*;37;+;18;*;33;*;31;*;37','107;=;900',0,1,NULL,'Switch on irrigation back wall for 15 min on thursday and sunday at 05h48'),(18,'22;*;33;*;35;*;37;+;26;*;33;*;35;*;37','108;=;600',0,1,NULL,'Switch on irrigation back grass for 10 min on wednesday and saturdays at 06'),(19,'2','101;=;1',15,0,NULL,'Motion test switch on'),(20,'41;*;42','101;=;1',5,0,NULL,'test gate open alarm'),(21,'43','125;=;1',0,1,NULL,'If was hot then set Was Hot item = 1'),(22,'44','125;=;0',0,1,NULL,'If midnight then cancel was hot'),(23,'37;*;33;*;45;*;47','118;=;600',0,1,NULL,'If was hot switch on Irrigation Bedrooms'),(24,'37;*;33;*;46;*;47','107;=;600',0,1,NULL,'If was hot switch on Irrigation back wall'),(25,'49;*;34','0;=;0',0,1,'pushOver.push(\'Irrigation is off\');','Irrigation armed check'),(27,'53','0;=;0',0,0,NULL,'Office test'),(28,'54;*;49','0;=;0',0,1,'pushOver.push(\'Electric fence is off\');','Electric fence off notify'),(29,'42;*;41','0;=;0',0,1,'pushOver.push(\'Gate alarm\');','Gate open alarm'),(31,'55;*;56','119;=;300',0,1,NULL,'Auto Pool Fill'),(32,'57;*;49','0;=;0',0,1,'pushOver.push(\'Pool Fill is off\');','Pool Fill Off Notify'),(33,'58;*;12','0;=;0',0,1,'sendPanic();','Back beam night mode'),(34,'59;*;12;+;59;*;62;+;59;*;65;+;59;*;8;+;14;*;59;+;66;*;59','0;=;0',0,0,'armDisarm(\"Disarm\");','Disarm alarm'),(35,'64','102;=;1',0,1,NULL,'Hallway test'),(36,'59;*;67;+;59;*;68','0;=;0',0,0,'armDisarm(\"Away\");','Away arm remote'),(37,'69;*;67;+;69;*;68','0;=;0',0,1,'armDisarm(\"Stay\");','Stay arm remote'),(38,'8;*;69;+;14;*;69;+;65;*;69','0;=;0',0,1,'armDisarm(\"Night\"); speak(\"Night Mode\");','Night arm remote'),(44,'39;+;40','130;=;0',0,1,NULL,'	Garage door cancel Driveway secure '),(47,'70;*;41;+;70;*;72','0;=;0',0,1,'pushOver.push(\'Driveway Alarm\');','Driveway Secure Alarm');
/*!40000 ALTER TABLE `Rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rules_toCheck`
--

DROP TABLE IF EXISTS `Rules_toCheck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Rules_toCheck` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Item_Id` int(11) NOT NULL,
  `State` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rules_toCheck`
--

LOCK TABLES `Rules_toCheck` WRITE;
/*!40000 ALTER TABLE `Rules_toCheck` DISABLE KEYS */;
/*!40000 ALTER TABLE `Rules_toCheck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_logins`
--

DROP TABLE IF EXISTS `user_logins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_logins` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(45) NOT NULL,
  `Session_id` int(11) NOT NULL,
  `Token` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_logins`
--

LOCK TABLES `user_logins` WRITE;
/*!40000 ALTER TABLE `user_logins` DISABLE KEYS */;
INSERT INTO `user_logins` VALUES (101,'marius',0,'6b0e493749ad26ec2792b881ccff10499fb80875efce708df578eca64ba1ab4b'),(102,'mariusmobileint',0,'7a40d74da69b034d9d89edbc46bd9deab22b9222eeecf63f954bace4e985449b'),(103,'mariuswork',0,'c0c438db0e6590adb28c50458efed263c92290e0d96c1b7db5621bdc7b076013'),(104,'mariusmobileext',0,'b2d80cee3b43d021b73a591044b7ea94bc6e0e98ebaee7aa517c03c770148634'),(105,'mariusmobileint',0,'ef906d8c83438815ea1c18a4f4b82b6f038840a1008b24ca670455381b87d552'),(106,'mariusmobileext',0,'ea03dbc98a5c0af7f92aa23d36d84a35d83655bbc6827772fb9f37e4a914f55b'),(107,'mariuswork',0,'85d76677354b7b1cd5ca520740a9bf01d689bac15e9c155d14845295943a8830'),(108,'mariusmobileext',0,'74f235086a192fbf28726b31087493467684dc7773e52b41b17e8b0c081298eb'),(109,'marius',0,'5b9546a06f5984c17d050e9a9d6ae9215e2d76a4f8c90d97e5460b80301ae623'),(110,'mariusmobileint',0,'ebd3bc83adf1e87be8d89af43f9cf7216c57cc4b4d5c17b79f1823b7e169bbfc'),(111,'mariuswork',0,'bcdeb33c2991cdb44c2cdcb5e06614ac8e02b1e2f2301a18171d38a02b0b315f'),(112,'mariusmobileext',0,'b388ac3809be0bd052608720f01f076763567cf3876fa7d490622177d502095e'),(113,'mariusmobileint',0,'e08d00f3f97f4e5ed96c3fa614f1794dcae7e1249e8e959ff0968e1a7b8d2686'),(114,'mariusmobileext',0,'7b6153afa907615e926c3e5f6f807bba5b281f1258571032e0ec063e63c106d7'),(115,'marius',0,'54c54fdd53e4866403fccd8ab4f0a5b1102075affe7c302f639dc75e352e7c68'),(116,'mariusmobileext',0,'7f20f4bba0cf42ffed63f8f3e572d84c192adafd78a09aaa39c6a14ef6fde48d'),(117,'mariusmobileint',0,'1868c3ce029f14e37990ad0d61160152c1c8f5ae96cc0ab821bc210933323029'),(118,'marius',0,'2262f54f00581dde45dac35e3ead676687a8199c578c02623464844cc5eb7895'),(119,'mariusmobileint',0,'0a751a8de6441a38bb233d1da5f65034a0f80edc303dd2e93692a56a700961f2'),(121,'marius',0,'6bfcf9d79872c122955e829dfba8fb8a983a8d2c04f8e2b49c5b000a96696b60'),(122,'marius',0,'629aaad9bfc5a498428f7b88028d89e38eaf27d77a289e1f7bc0df80347af46e'),(123,'mariusmobileext',0,'8dc59d8aaa1f61b32514c664eecb8415e9c5a01f7b540e846a0017e594b5ab66'),(124,'mariusmobileint',0,'ca96020440b0936b1e483dd1323e8b3d2284ea1d6b7d8b8ad32a0c3985962565'),(125,'marius',0,'1531f4744d2989514c0d735032c60361b376c6f5468fdc2fb8922c14ad77a263'),(126,'mariuswork',0,'d94d219a907e21b5066760b25d65eef493320ba22e2bf94b170b7e8e648ceb7c'),(127,'mariusmobileext',0,'e6701c348c5143943903d6375de46f10ba4d7d6fafc95df58d37c54002191e6c'),(128,'mariusmobileint',0,'f67776f4e901808c216f7809f80d01545555af758f89249fffa1f0304e7c3a07'),(129,'mariusmobileint',0,'06cac96fb5a05718bdaa9cbf57533cfad9690c0cdf512e1555a9f34bd7c8730f'),(130,'mariuswork',0,'6d12c20a914667991661d458a8022890c7c671cc512779c9ed518a4e5825cdd3'),(131,'mariusmobileext',0,'ea7ebc98ffe5bf0c943b5a9cf3b93dd630faeff669a8eb8442468a4da49c2822'),(132,'mariusmobileext',0,'5e3b621a0c3c7ef55b708f749b385199f4cc8fef83d705303e609a0948c59627'),(133,'marius',0,'9cfa839cbd57f185a25d595948014196be575f69b336775935f6b5d362e776c6'),(134,'marius',0,'9dc65b90c779b53d0fc4e37d48a26970677c9c02660ea8a372ac7a4b1a1ffdd4'),(135,'mariusmobileint',0,'9ba5e33ef5e40fbab22ec5d3a0fb3356463909773aece701b2769f77bd92204b'),(136,'mariusmobileint',0,'b48710b9651ae7371442b44362d0208d6768119a9c026943c0064dc9700d57f7'),(137,'mariuswork',0,'a3476e5732e422d7bb3088040780a8a16b145a29eb57760287759550f9e0633f'),(138,'mariusmobileext',0,'455ba3b037d381c77b30769f2a798d97f029cc737564b850f18cdef2cff37055');
/*!40000 ALTER TABLE `user_logins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` char(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (12,'marius','$2a$10$JR2d6Pv4mf8PiRSx/hucD.UzQVnwH1Av5o4S5cyVVTCN93n1RNyaC'),(13,'mariusmobileint','$2a$10$cDlEgi1uakciKyZa9DtaSeBXuwHTQ0xoMD9ikos9jSebBaHLzPS7e'),(14,'mariusmobileext','$2a$10$fM4LF5ug9BDrG8KsTV3lPOrlCHKoeFs23qqq2jHJVyCTgV90y9ktu'),(15,'mariuswork','$2a$10$9VqNAE3FQWrDCkThOnFlSO1oUsk4DGr1vUZo12YrjQ1WU/rcP2TJ2'),(16,'guest','$2a$10$1an4gUSq0TFjYmFQgIcxfuwuVfVQH5WG0ZG9rMyFyYzRxq2Dpfv7C'),(18,'lianie','$2a$10$cGvon2U8ROpRkeVPs1/4J.pTQEf5KyIc1t/LCgXG7Bi/SCyn1NE8O');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'CleoHomeDB'
--

--
-- Dumping routines for database 'CleoHomeDB'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-27 21:29:14
