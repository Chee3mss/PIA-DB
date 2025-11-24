CREATE DATABASE  IF NOT EXISTS `stageGo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `stageGo`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 72.60.123.201    Database: stageGo
-- ------------------------------------------------------
-- Server version	8.4.7

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
-- Table structure for table `Auditorio`
--

DROP TABLE IF EXISTS `Auditorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Auditorio` (
  `id_auditorio` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `capacidad` int DEFAULT NULL,
  `id_sede` int NOT NULL,
  `seatsio_event_key` varchar(255) DEFAULT NULL COMMENT 'Event key de Seats.io para este auditorio',
  `seatsio_public_key` varchar(255) DEFAULT NULL COMMENT 'Public key de Seats.io (puede ser global o por auditorio)',
  `activo` bit(1) DEFAULT b'1' COMMENT 'Indica si el auditorio estÃ¡ activo',
  PRIMARY KEY (`id_auditorio`),
  KEY `id_sede` (`id_sede`),
  CONSTRAINT `Auditorio_ibfk_1` FOREIGN KEY (`id_sede`) REFERENCES `Sede` (`id_sede`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Auditorio`
--

LOCK TABLES `Auditorio` WRITE;
/*!40000 ALTER TABLE `Auditorio` DISABLE KEYS */;
INSERT INTO `Auditorio` VALUES (1,'Auditorio Principal',12000,1,NULL,NULL,_binary ''),(2,'Sala Central',2000,2,'b57c9e95-a0e3-303e-f2cb-984f80dbc62c',NULL,_binary ''),(3,'PabellÃ³n M',3500,3,NULL,NULL,_binary ''),(4,'Showcenter Complex',5500,4,NULL,NULL,_binary '');
/*!40000 ALTER TABLE `Auditorio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Boletos`
--

DROP TABLE IF EXISTS `Boletos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Boletos` (
  `id_boleto` int NOT NULL AUTO_INCREMENT,
  `asiento` varchar(10) DEFAULT NULL,
  `precio_final` decimal(10,2) NOT NULL,
  `vigente` bit(1) DEFAULT b'1',
  `id_tipo_boleto` int NOT NULL,
  `id_estado_boleto` int NOT NULL,
  `id_funcion` int NOT NULL,
  `id_venta` int DEFAULT NULL,
  PRIMARY KEY (`id_boleto`),
  KEY `id_tipo_boleto` (`id_tipo_boleto`),
  KEY `id_estado_boleto` (`id_estado_boleto`),
  KEY `id_funcion` (`id_funcion`),
  KEY `id_venta` (`id_venta`),
  CONSTRAINT `Boletos_ibfk_1` FOREIGN KEY (`id_tipo_boleto`) REFERENCES `Tipo_Boleto` (`id_tipo_boleto`),
  CONSTRAINT `Boletos_ibfk_2` FOREIGN KEY (`id_estado_boleto`) REFERENCES `Estado_Boleto` (`id_estado_boleto`),
  CONSTRAINT `Boletos_ibfk_3` FOREIGN KEY (`id_funcion`) REFERENCES `Funciones` (`id_funcion`),
  CONSTRAINT `Boletos_ibfk_4` FOREIGN KEY (`id_venta`) REFERENCES `Ventas` (`id_venta`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Boletos`
--

LOCK TABLES `Boletos` WRITE;
/*!40000 ALTER TABLE `Boletos` DISABLE KEYS */;
INSERT INTO `Boletos` VALUES (1,'A1',1200.00,_binary '',1,3,1,1),(2,'A2',1200.00,_binary '',1,3,1,1),(3,'A3',1500.00,_binary '',1,1,1,NULL),(4,'A4',1500.00,_binary '',1,1,1,NULL),(5,'B10',500.00,_binary '',2,3,2,2),(6,'B11',500.00,_binary '',2,1,2,NULL),(7,'B12',500.00,_binary '',2,1,2,NULL),(8,'VIP-A-12',500.00,_binary '',2,3,17,3),(9,'VIP-A-11',500.00,_binary '',2,3,17,3),(10,'VIP-A-12',500.00,_binary '',2,3,17,4),(11,'VIP-A-11',500.00,_binary '',2,3,17,4),(12,'VIP-A-21',500.00,_binary '',2,3,17,5),(13,'VIP-A-20',500.00,_binary '',2,3,17,5),(14,'VIP-A-21',500.00,_binary '',2,3,17,6),(15,'VIP-A-20',500.00,_binary '',2,3,17,6),(16,'VIP-A-11',500.00,_binary '',2,3,17,7),(17,'VIP-A-11',500.00,_binary '',2,3,17,8),(18,'VIP-A-12',500.00,_binary '',2,3,17,7),(19,'VIP-A-12',500.00,_binary '',2,3,17,8),(20,'VIP-A-10',500.00,_binary '',2,3,17,10),(21,'VIP-A-10',500.00,_binary '',2,3,17,9),(22,'VIP-A-9',500.00,_binary '',2,3,17,10),(23,'VIP-A-9',500.00,_binary '',2,3,17,9);
/*!40000 ALTER TABLE `Boletos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Clientes`
--

DROP TABLE IF EXISTS `Clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `numero_registro` varchar(50) DEFAULT NULL,
  `fecha_registro` date DEFAULT (curdate()),
  `id_municipio` int NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `numero_registro` (`numero_registro`),
  KEY `id_municipio` (`id_municipio`),
  CONSTRAINT `Clientes_ibfk_1` FOREIGN KEY (`id_municipio`) REFERENCES `Municipio` (`id_municipio`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Clientes`
--

LOCK TABLES `Clientes` WRITE;
/*!40000 ALTER TABLE `Clientes` DISABLE KEYS */;
INSERT INTO `Clientes` VALUES (1,'Carlos Perez','carlos.perez@email.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','8188899900','C001','2025-11-01',19039),(2,'Maria Lopez','maria.lopez@email.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','8187788990','C002','2025-11-02',14039),(3,'Usuario','andres_monsivais@hotmail.com','$2a$10$FVX/1H/..Aym5GLEBwUzWOGLjs6UO5WjpMuRhXFZZcgHMcMXaHtB2',NULL,'CLI-1763131879794','2025-11-14',19039),(4,'Jose Luis','admin2@stagego.com','$2a$10$.R6Ik0PmTb//oTaaHqpcou4wC8TgUtKpw5hyPoHfMM5gd0Ep2QdKa',NULL,'CLI-1763134368773','2025-11-14',19039),(5,'test','admin3@stagego.com','$2a$10$XGNVM3a30dp4XgwgmNgrguH05yEzwAaV193gJOdSi2/cwSGx8Pbk.',NULL,'CLI-1763134791126','2025-11-14',19039),(6,'test4','admin9@stagego.com','$2a$10$rF5QJLjPXXW.e5X2PphLgOe6dQTGE2vmmu65ewNncg6/l3iCWiL8i',NULL,'CLI-1763135920147','2025-11-14',19039);
/*!40000 ALTER TABLE `Clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Empleado`
--

DROP TABLE IF EXISTS `Empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Empleado` (
  `id_empleado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `salario` decimal(10,2) DEFAULT NULL,
  `id_estado_empleado` int NOT NULL,
  `id_tipo_empleado` int NOT NULL,
  PRIMARY KEY (`id_empleado`),
  UNIQUE KEY `email` (`email`),
  KEY `id_estado_empleado` (`id_estado_empleado`),
  KEY `id_tipo_empleado` (`id_tipo_empleado`),
  CONSTRAINT `Empleado_ibfk_1` FOREIGN KEY (`id_estado_empleado`) REFERENCES `Estado_Empleado` (`id_estado_empleado`),
  CONSTRAINT `Empleado_ibfk_2` FOREIGN KEY (`id_tipo_empleado`) REFERENCES `Tipo_Empleado` (`id_tipo_empleado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Empleado`
--

LOCK TABLES `Empleado` WRITE;
/*!40000 ALTER TABLE `Empleado` DISABLE KEYS */;
INSERT INTO `Empleado` VALUES (1,'Admin','Sistema','admin@stagego.com','$2a$10$rOOqKCqW8x.9pzB.$2a$10$XGNVM3a30dp4XgwgmNgrguH05yEzwAaV193gJOdSi2/cwSGx8Pbk.','8199999999',20000.00,1,3),(2,'Luis','Salinas','luis.salinas@stagego.com','$2a$10$XGNVM3a30dp4XgwgmNgrguH05yEzwAaV193gJOdSi2/cwSGx8Pbk.','8123456789',9500.00,1,1),(3,'Ana','Garcia','ana.garcia@stagego.com','$2a$10$XGNVM3a30dp4XgwgmNgrguH05yEzwAaV193gJOdSi2/cwSGx8Pbk.','8111122233',16000.00,1,2),(4,'Admin','','adminf@stagego.com','$2a$10$yT99y9oERUKpSJZn4E.ykOqbeupa92p.qk4H1zcTwomTeKSbTAONu',NULL,0.00,1,3);
/*!40000 ALTER TABLE `Empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Estado`
--

DROP TABLE IF EXISTS `Estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Estado` (
  `id_estado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Estado`
--

LOCK TABLES `Estado` WRITE;
/*!40000 ALTER TABLE `Estado` DISABLE KEYS */;
INSERT INTO `Estado` VALUES (1,'Aguascalientes'),(2,'Baja California'),(3,'Baja California Sur'),(4,'Campeche'),(5,'Chiapas'),(6,'Chihuahua'),(7,'Coahuila'),(8,'Colima'),(9,'Ciudad de MÃ©xico'),(10,'Durango'),(11,'Guanajuato'),(12,'Guerrero'),(13,'Hidalgo'),(14,'Jalisco'),(15,'Estado de MÃ©xico'),(16,'MichoacÃ¡n'),(17,'Morelos'),(18,'Nayarit'),(19,'Nuevo LeÃ³n'),(20,'Oaxaca'),(21,'Puebla'),(22,'QuerÃ©taro'),(23,'Quintana Roo'),(24,'San Luis PotosÃ­'),(25,'Sinaloa'),(26,'Sonora'),(27,'Tabasco'),(28,'Tamaulipas'),(29,'Tlaxcala'),(30,'Veracruz'),(31,'YucatÃ¡n'),(32,'Zacatecas');
/*!40000 ALTER TABLE `Estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Estado_Boleto`
--

DROP TABLE IF EXISTS `Estado_Boleto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Estado_Boleto` (
  `id_estado_boleto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_estado_boleto`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Estado_Boleto`
--

LOCK TABLES `Estado_Boleto` WRITE;
/*!40000 ALTER TABLE `Estado_Boleto` DISABLE KEYS */;
INSERT INTO `Estado_Boleto` VALUES (1,'Disponible','Boleto disponible para la venta'),(2,'Reservado','Boleto temporalmente reservado'),(3,'Vendido','Boleto vendido y pagado'),(4,'Cancelado','Boleto cancelado');
/*!40000 ALTER TABLE `Estado_Boleto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Estado_Empleado`
--

DROP TABLE IF EXISTS `Estado_Empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Estado_Empleado` (
  `id_estado_empleado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_estado_empleado`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Estado_Empleado`
--

LOCK TABLES `Estado_Empleado` WRITE;
/*!40000 ALTER TABLE `Estado_Empleado` DISABLE KEYS */;
INSERT INTO `Estado_Empleado` VALUES (1,'Activo','Empleado en funciones'),(2,'Inactivo','Empleado dado de baja');
/*!40000 ALTER TABLE `Estado_Empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Evento`
--

DROP TABLE IF EXISTS `Evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Evento` (
  `id_evento` int NOT NULL AUTO_INCREMENT,
  `nombre_evento` varchar(150) NOT NULL,
  `descripcion` text,
  `imagen_url` varchar(500) DEFAULT NULL,
  `clasificacion` varchar(50) DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `id_tipo_evento` int NOT NULL,
  `id_empleado` int NOT NULL,
  PRIMARY KEY (`id_evento`),
  KEY `id_tipo_evento` (`id_tipo_evento`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `Evento_ibfk_1` FOREIGN KEY (`id_tipo_evento`) REFERENCES `Tipo_Evento` (`id_tipo_evento`),
  CONSTRAINT `Evento_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `Empleado` (`id_empleado`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Evento`
--

LOCK TABLES `Evento` WRITE;
/*!40000 ALTER TABLE `Evento` DISABLE KEYS */;
INSERT INTO `Evento` VALUES (1,'Concierto de Coldplay','PresentaciÃ³n de la banda britÃ¡nica con su tour mundial 2025. Una experiencia musical inolvidable.','https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800','Todo PÃºblico','2025-12-01 20:00:00','2025-12-01 23:00:00',1,1),(2,'Bad Bunny World Tourrr','El conejo malo regresa a MÃ©xico con su tour mÃ¡s esperado del aÃ±o.','https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800','Todo PÃºblico','2025-11-15 21:00:00','2025-11-15 23:30:00',1,1),(3,'Festival Pa\'l Norte 2025','El festival mÃ¡s grande del norte de MÃ©xico con artistas internacionales.','https://aiplay.mx/wp-content/uploads/2025/11/FB_IMG_1759772086672-780x470.jpg','Mayor 18','2025-03-20 20:00:00','2025-03-22 08:00:00',5,1),(4,'Karol G - MaÃ±ana SerÃ¡ Bonito Tour','La bichota llega con su mejor show. Una noche llena de reggaetÃ³n y emociones.','https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800','Mayor 12','2025-11-28 21:00:00','2025-11-28 23:30:00',1,1),(5,'Metallica En Concierto','Los reyes del metal regresan con un show Ã©pico lleno de clÃ¡sicos.','https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800','Mayor 18','2025-12-18 20:00:00','2025-12-18 23:00:00',1,1),(6,'Grupo Firme - Tour 2025','La banda mexicana mÃ¡s popular presenta su nuevo tour.','https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800','Todo PÃºblico','2025-12-22 21:00:00','2025-12-22 23:30:00',1,1),(7,'El Rey LeÃ³n','Obra de teatro musical basada en la pelÃ­cula de Disney. Una experiencia mÃ¡gica.','https://images.unsplash.com/photo-1503095396549-807759245b35?w=800','Todo PÃºblico','2025-11-20 19:00:00','2025-11-30 21:30:00',2,1),(8,'Romeo y Julieta plus','La clÃ¡sica obra de Shakespeare en una adaptaciÃ³n moderna y emocionante.','https://anagnorisis.es/wp-content/uploads/2024/06/romeo-y-julieta-obra-de-teatro-2-800x521.jpg','Mayor 12','2025-12-10 20:00:00','2025-12-20 22:00:00',2,1),(9,'Hamilton MÃ©xico','El musical mÃ¡s aclamado de Broadway llega a MÃ©xico por primera vez.','https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800','Mayor 12','2025-11-30 20:00:00','2025-12-15 22:00:00',2,1),(10,'La Casa de Bernarda Alba','Una de las obras mÃ¡s emblemÃ¡ticas del teatro espaÃ±ol. Imperdible.','https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800','Mayor 15','2026-01-05 19:00:00','2026-01-20 21:00:00',2,1),(11,'Final Liga MX','Gran final del torneo de fÃºtbol mexicano. Â¡No te lo pierdas!','https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800','Todo PÃºblico','2025-12-15 19:00:00','2025-12-15 21:00:00',3,1),(12,'NBA Mexico Game','Juego de la NBA en territorio mexicano. EspectÃ¡culo deportivo de clase mundial.','https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800','Todo PÃºblico','2025-12-05 20:00:00','2025-12-05 22:30:00',3,1),(13,'WWE Monday Night Raw','La WWE llega a MÃ©xico con sus mejores superestrellas en vivo.','https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=800','Todo PÃºblico','2025-11-30 20:00:00','2025-11-30 23:00:00',3,1),(14,'Pelea Canelo Ãlvarez','El mejor boxeador mexicano defiende su tÃ­tulo mundial.','https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800','Mayor 18','2025-12-20 20:00:00','2025-12-20 23:00:00',3,1),(15,'Franco Escamilla','El comediante mÃ¡s famoso de MÃ©xico presenta su nuevo show.','https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800','Mayor 18','2025-11-25 21:00:00','2025-11-25 23:00:00',4,1),(16,'Eugenio Derbez Live','El actor y comediante presenta un show Ãºnico lleno de risas.','https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800','Mayor 12','2025-12-08 20:00:00','2025-12-08 22:00:00',4,1),(17,'Chumel Torres - El Pulso','AnÃ¡lisis polÃ­tico con humor. El conductor mÃ¡s polÃ©mico de MÃ©xico.','https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800','Mayor 18','2025-12-02 21:00:00','2025-12-02 23:00:00',4,1),(19,'Tech Summit 2025','La conferencia de tecnologÃ­a mÃ¡s importante de LatinoamÃ©rica.','https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800','Todo PÃºblico','2025-11-18 09:00:00','2025-11-19 18:00:00',6,1),(20,'Marketing Digital Expo','Aprende de los mejores expertos en marketing digital y redes sociales.','https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800','Mayor 18','2025-12-12 10:00:00','2025-12-12 19:00:00',6,1),(21,'Cumbre de InnovaciÃ³n','Los lÃ­deres empresariales mÃ¡s influyentes comparten sus experiencias.','https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800','Todo PÃºblico','2025-12-08 08:00:00','2025-12-08 19:00:00',6,1);
/*!40000 ALTER TABLE `Evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Funciones`
--

DROP TABLE IF EXISTS `Funciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Funciones` (
  `id_funcion` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` varchar(50) DEFAULT 'Programada',
  `boletos_vendidos` int DEFAULT '0',
  `recaudacion` decimal(10,2) DEFAULT '0.00',
  `id_evento` int NOT NULL,
  `id_auditorio` int NOT NULL,
  `seatsio_event_key` varchar(255) DEFAULT NULL COMMENT 'Event key de Seats.io para esta funciÃ³n',
  `seatsio_chart_key` varchar(255) DEFAULT NULL COMMENT 'Chart key usado en Seats.io',
  PRIMARY KEY (`id_funcion`),
  KEY `id_evento` (`id_evento`),
  KEY `id_auditorio` (`id_auditorio`),
  KEY `idx_seatsio_event_key` (`seatsio_event_key`),
  CONSTRAINT `Funciones_ibfk_1` FOREIGN KEY (`id_evento`) REFERENCES `Evento` (`id_evento`),
  CONSTRAINT `Funciones_ibfk_2` FOREIGN KEY (`id_auditorio`) REFERENCES `Auditorio` (`id_auditorio`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Funciones`
--

LOCK TABLES `Funciones` WRITE;
/*!40000 ALTER TABLE `Funciones` DISABLE KEYS */;
INSERT INTO `Funciones` VALUES (1,'2025-12-01','20:00:00','Programada',0,0.00,1,1,NULL,NULL),(2,'2025-11-25','19:00:00','Programada',0,0.00,2,2,NULL,NULL),(3,'2025-11-15','21:00:00','Programada',0,0.00,2,3,NULL,NULL),(4,'2025-11-28','21:00:00','Programada',0,0.00,4,4,NULL,NULL),(5,'2025-12-18','20:00:00','Programada',0,0.00,5,4,NULL,NULL),(6,'2025-12-22','21:00:00','Programada',0,0.00,6,3,NULL,NULL),(7,'2025-03-20','14:00:00','Programada',0,0.00,3,4,NULL,NULL),(8,'2025-03-21','14:00:00','Programada',0,0.00,3,4,NULL,NULL),(9,'2025-03-22','14:00:00','Programada',0,0.00,3,4,NULL,NULL),(11,'2025-11-30','20:00:00','Programada',0,0.00,13,4,NULL,NULL),(12,'2025-11-22','02:20:00','Programada',0,0.00,7,2,NULL,NULL),(13,'2025-11-26','02:30:00','Programada',0,0.00,15,2,NULL,NULL),(14,'2025-11-15','23:30:00','Programada',0,0.00,19,2,NULL,NULL),(15,'2025-11-22','20:00:00','Programada',0,0.00,21,2,NULL,NULL),(16,'2025-11-20','17:48:00','Programada',0,0.00,19,2,'deb3e135-9096-4ef8-9bf9-08dd0d27ff99',NULL),(17,'2025-11-21','23:00:00','Programada',0,0.00,16,2,'bd4ce69e-02fa-44c8-8ea0-30b4b753bb98',NULL);
/*!40000 ALTER TABLE `Funciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Metodo_Pago`
--

DROP TABLE IF EXISTS `Metodo_Pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Metodo_Pago` (
  `id_metodo` int NOT NULL AUTO_INCREMENT,
  `nombre_metodo` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `comision` decimal(5,2) DEFAULT '0.00',
  `activo` bit(1) DEFAULT b'1',
  PRIMARY KEY (`id_metodo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Metodo_Pago`
--

LOCK TABLES `Metodo_Pago` WRITE;
/*!40000 ALTER TABLE `Metodo_Pago` DISABLE KEYS */;
INSERT INTO `Metodo_Pago` VALUES (1,'Tarjeta de crÃ©dito','Pago con tarjeta VISA/MasterCard',2.50,_binary ''),(2,'Efectivo','Pago en taquilla',0.00,_binary '');
/*!40000 ALTER TABLE `Metodo_Pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Municipio`
--

DROP TABLE IF EXISTS `Municipio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Municipio` (
  `id_municipio` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `id_estado` int NOT NULL,
  PRIMARY KEY (`id_municipio`),
  KEY `id_estado` (`id_estado`),
  CONSTRAINT `Municipio_ibfk_1` FOREIGN KEY (`id_estado`) REFERENCES `Estado` (`id_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=32059 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Municipio`
--

LOCK TABLES `Municipio` WRITE;
/*!40000 ALTER TABLE `Municipio` DISABLE KEYS */;
INSERT INTO `Municipio` VALUES (1001,'Aguascalientes',1),(1002,'Asientos',1),(1003,'Calvillo',1),(1004,'CosÃ­o',1),(1005,'JesÃºs MarÃ­a',1),(1006,'PabellÃ³n de Arteaga',1),(1007,'RincÃ³n de Romos',1),(1008,'San JosÃ© de Gracia',1),(1009,'TepezalÃ¡',1),(1010,'El Llano',1),(1011,'San Francisco de los Romo',1),(2001,'Ensenada',2),(2002,'Mexicali',2),(2003,'Tecate',2),(2004,'Tijuana',2),(2005,'Playas de Rosarito',2),(3001,'ComondÃº',3),(3002,'MulegÃ©',3),(3003,'La Paz',3),(3008,'Los Cabos',3),(3009,'Loreto',3),(4001,'CalkinÃ­',4),(4002,'Campeche',4),(4003,'Carmen',4),(4004,'ChampotÃ³n',4),(4005,'HecelchakÃ¡n',4),(4006,'HopelchÃ©n',4),(4007,'Palizada',4),(4008,'Tenabo',4),(4009,'EscÃ¡rcega',4),(4010,'Calakmul',4),(4011,'Candelaria',4),(5001,'Abasolo',5),(5002,'AcuÃ±a',5),(5003,'Allende',5),(5004,'Arteaga',5),(5005,'Candela',5),(5006,'CastaÃ±os',5),(5007,'Cuatro CiÃ©negas',5),(5008,'Escobedo',5),(5009,'Francisco I. Madero',5),(5010,'Frontera',5),(5011,'General Cepeda',5),(5012,'Guerrero',5),(5013,'Hidalgo',5),(5014,'JimÃ©nez',5),(5015,'JuÃ¡rez',5),(5016,'Lamadrid',5),(5017,'Matamoros',5),(5018,'Monclova',5),(5019,'Morelos',5),(5020,'MÃºzquiz',5),(5021,'Nadadores',5),(5022,'Nava',5),(5023,'Ocampo',5),(5024,'Parras',5),(5025,'Piedras Negras',5),(5026,'Progreso',5),(5027,'Ramos Arizpe',5),(5028,'Sabinas',5),(5029,'Sacramento',5),(5030,'Saltillo',5),(5031,'San Buenaventura',5),(5032,'San Juan de Sabinas',5),(5033,'San Pedro',5),(5034,'Sierra Mojada',5),(5035,'TorreÃ³n',5),(5036,'Viesca',5),(5037,'Villa UniÃ³n',5),(5038,'Zaragoza',5),(6001,'ArmerÃ­a',6),(6002,'Colima',6),(6003,'Comala',6),(6004,'CoquimatlÃ¡n',6),(6005,'CuauhtÃ©moc',6),(6006,'IxtlahuacÃ¡n',6),(6007,'Manzanillo',6),(6008,'MinatitlÃ¡n',6),(6009,'TecomÃ¡n',6),(6010,'Villa de Ãlvarez',6),(7001,'Acacoyagua',7),(7002,'Acala',7),(7003,'Acapetahua',7),(7004,'Altamirano',7),(7005,'AmatÃ¡n',7),(7006,'Amatenango de la Frontera',7),(7007,'Amatenango del Valle',7),(7008,'Angel Albino Corzo',7),(7009,'Arriaga',7),(7010,'Bejucal de Ocampo',7),(7011,'Bella Vista',7),(7012,'BerriozÃ¡bal',7),(7013,'Bochil',7),(7014,'El Bosque',7),(7015,'CacahoatÃ¡n',7),(7016,'CatazajÃ¡',7),(7017,'Cintalapa',7),(7018,'Coapilla',7),(7019,'ComitÃ¡n de DomÃ­nguez',7),(7020,'La Concordia',7),(7021,'CopainalÃ¡',7),(7022,'ChalchihuitÃ¡n',7),(7023,'Chamula',7),(7024,'Chanal',7),(7025,'Chapultenango',7),(7026,'ChenalhÃ³',7),(7027,'Chiapa de Corzo',7),(7028,'Chiapilla',7),(7029,'ChicoasÃ©n',7),(7030,'Chicomuselo',7),(7031,'ChilÃ³n',7),(7032,'Escuintla',7),(7033,'Francisco LeÃ³n',7),(7034,'Frontera Comalapa',7),(7035,'Frontera Hidalgo',7),(7036,'La Grandeza',7),(7037,'HuehuetÃ¡n',7),(7038,'HuixtÃ¡n',7),(7039,'HuitiupÃ¡n',7),(7040,'Huixtla',7),(7041,'La Independencia',7),(7042,'IxhuatÃ¡n',7),(7043,'IxtacomitÃ¡n',7),(7044,'Ixtapa',7),(7045,'Ixtapangajoya',7),(7046,'Jiquipilas',7),(7047,'Jitotol',7),(7048,'JuÃ¡rez',7),(7049,'LarrÃ¡inzar',7),(7050,'La Libertad',7),(7051,'Mapastepec',7),(7052,'Las Margaritas',7),(7053,'Mazapa de Madero',7),(7054,'MazatÃ¡n',7),(7055,'Metapa',7),(7056,'Mitontic',7),(7057,'Motozintla',7),(7058,'NicolÃ¡s RuÃ­z',7),(7059,'Ocosingo',7),(7060,'Ocotepec',7),(7061,'Ocozocoautla de Espinosa',7),(7062,'OstuacÃ¡n',7),(7063,'Osumacinta',7),(7064,'Oxchuc',7),(7065,'Palenque',7),(7066,'PantelhÃ³',7),(7067,'Pantepec',7),(7068,'Pichucalco',7),(7069,'Pijijiapan',7),(7070,'El Porvenir',7),(7071,'Villa ComaltitlÃ¡n',7),(7072,'Pueblo Nuevo SolistahuacÃ¡n',7),(7073,'RayÃ³n',7),(7074,'Reforma',7),(7075,'Las Rosas',7),(7076,'Sabanilla',7),(7077,'Salto de Agua',7),(7078,'San CristÃ³bal de las Casas',7),(7079,'San Fernando',7),(7080,'Siltepec',7),(7081,'Simojovel',7),(7082,'SitalÃ¡',7),(7083,'Socoltenango',7),(7084,'Solosuchiapa',7),(7085,'SoyalÃ³',7),(7086,'Suchiapa',7),(7087,'Suchiate',7),(7088,'Sunuapa',7),(7089,'Tapachula',7),(7090,'Tapalapa',7),(7091,'Tapilula',7),(7092,'TecpatÃ¡n',7),(7093,'Tenejapa',7),(7094,'Teopisca',7),(7096,'Tila',7),(7097,'TonalÃ¡',7),(7098,'Totolapa',7),(7099,'La Trinitaria',7),(7100,'TumbalÃ¡',7),(7101,'Tuxtla GutiÃ©rrez',7),(7102,'Tuxtla Chico',7),(7103,'TuzantÃ¡n',7),(7104,'Tzimol',7),(7105,'UniÃ³n JuÃ¡rez',7),(7106,'Venustiano Carranza',7),(7107,'Villa Corzo',7),(7108,'Villaflores',7),(7109,'YajalÃ³n',7),(7110,'San Lucas',7),(7111,'ZinacantÃ¡n',7),(7112,'San Juan Cancuc',7),(7113,'Aldama',7),(7114,'BenemÃ©rito de las AmÃ©ricas',7),(7115,'Maravilla Tenejapa',7),(7116,'MarquÃ©s de Comillas',7),(7117,'Montecristo de Guerrero',7),(7118,'San AndrÃ©s Duraznal',7),(7119,'Santiago el Pinar',7),(7120,'CapitÃ¡n Luis Ãngel Vidal',7),(7121,'RincÃ³n Chamula San Pedro',7),(7122,'El Parral',7),(7123,'Emiliano Zapata',7),(7124,'Mezcalapa',7),(8001,'Ahumada',8),(8002,'Aldama',8),(8003,'Allende',8),(8004,'Aquiles SerdÃ¡n',8),(8005,'AscensiÃ³n',8),(8006,'BachÃ­niva',8),(8007,'Balleza',8),(8008,'Batopilas de Manuel GÃ³mez MorÃ­n',8),(8009,'Bocoyna',8),(8010,'Buenaventura',8),(8011,'Camargo',8),(8012,'CarichÃ­',8),(8013,'Casas Grandes',8),(8014,'Coronado',8),(8015,'Coyame del Sotol',8),(8016,'La Cruz',8),(8017,'CuauhtÃ©moc',8),(8018,'Cusihuiriachi',8),(8019,'Chihuahua',8),(8020,'ChÃ­nipas',8),(8021,'Delicias',8),(8022,'Dr. Belisario DomÃ­nguez',8),(8023,'Galeana',8),(8024,'Santa Isabel',8),(8025,'GÃ³mez FarÃ­as',8),(8026,'Gran Morelos',8),(8027,'Guachochi',8),(8028,'Guadalupe',8),(8029,'Guadalupe y Calvo',8),(8030,'Guazapares',8),(8031,'Guerrero',8),(8032,'Hidalgo del Parral',8),(8033,'HuejotitÃ¡n',8),(8034,'Ignacio Zaragoza',8),(8035,'Janos',8),(8036,'JimÃ©nez',8),(8037,'JuÃ¡rez',8),(8038,'Julimes',8),(8039,'LÃ³pez',8),(8040,'Madera',8),(8041,'Maguarichi',8),(8042,'Manuel Benavides',8),(8043,'MatachÃ­',8),(8044,'Matamoros',8),(8045,'Meoqui',8),(8046,'Morelos',8),(8047,'Moris',8),(8048,'Namiquipa',8),(8049,'Nonoava',8),(8050,'Nuevo Casas Grandes',8),(8051,'Ocampo',8),(8052,'Ojinaga',8),(8053,'Praxedis G. Guerrero',8),(8054,'Riva Palacio',8),(8055,'Rosales',8),(8056,'Rosario',8),(8057,'San Francisco de Borja',8),(8058,'San Francisco de Conchos',8),(8059,'San Francisco del Oro',8),(8060,'Santa BÃ¡rbara',8),(8061,'SatevÃ³',8),(8062,'Saucillo',8),(8063,'TemÃ³sachic',8),(8064,'El Tule',8),(8065,'Urique',8),(8066,'Uruachi',8),(8067,'Valle de Zaragoza',8),(9002,'Azcapotzalco',9),(9003,'CoyoacÃ¡n',9),(9004,'Cuajimalpa de Morelos',9),(9005,'Gustavo A. Madero',9),(9006,'Iztacalco',9),(9007,'Iztapalapa',9),(9008,'La Magdalena Contreras',9),(9009,'Milpa Alta',9),(9010,'Ãlvaro ObregÃ³n',9),(9011,'TlÃ¡huac',9),(9012,'Tlalpan',9),(9013,'Xochimilco',9),(9014,'Benito JuÃ¡rez',9),(9015,'CuauhtÃ©moc',9),(9016,'Miguel Hidalgo',9),(9017,'Venustiano Carranza',9),(10001,'CanatlÃ¡n',10),(10002,'Canelas',10),(10003,'Coneto de Comonfort',10),(10004,'CuencamÃ©',10),(10005,'Durango',10),(10006,'General SimÃ³n BolÃ­var',10),(10007,'GÃ³mez Palacio',10),(10008,'Guadalupe Victoria',10),(10009,'GuanacevÃ­',10),(10010,'Hidalgo',10),(10011,'IndÃ©',10),(10012,'Lerdo',10),(10013,'MapimÃ­',10),(10014,'Mezquital',10),(10015,'Nazas',10),(10016,'Nombre de Dios',10),(10017,'Ocampo',10),(10018,'El Oro',10),(10019,'OtÃ¡ez',10),(10020,'PÃ¡nuco de Coronado',10),(10021,'PeÃ±Ã³n Blanco',10),(10022,'Poanas',10),(10023,'Pueblo Nuevo',10),(10024,'Rodeo',10),(10025,'San Bernardo',10),(10026,'San Dimas',10),(10027,'San Juan de Guadalupe',10),(10028,'San Juan del RÃ­o',10),(10029,'San Luis del Cordero',10),(10030,'San Pedro del Gallo',10),(10031,'Santa Clara',10),(10032,'Santiago Papasquiaro',10),(10033,'SÃºchil',10),(10034,'Tamazula',10),(10035,'Tepehuanes',10),(10036,'Tlahualilo',10),(10037,'Topia',10),(10038,'Vicente Guerrero',10),(10039,'Nuevo Ideal',10),(11001,'Abasolo',11),(11002,'AcÃ¡mbaro',11),(11003,'San Miguel de Allende',11),(11004,'Apaseo el Alto',11),(11005,'Apaseo el Grande',11),(11006,'Atarjea',11),(11007,'Celaya',11),(11008,'Manuel Doblado',11),(11009,'Comonfort',11),(11010,'Coroneo',11),(11011,'Cortazar',11),(11012,'CuerÃ¡maro',11),(11013,'Doctor Mora',11),(11014,'Dolores Hidalgo Cuna de la Independencia Nacional',11),(11015,'Guanajuato',11),(11016,'HuanÃ­maro',11),(11017,'Irapuato',11),(11018,'Jaral del Progreso',11),(11019,'JerÃ©cuaro',11),(11020,'LeÃ³n',11),(11021,'MoroleÃ³n',11),(11022,'Ocampo',11),(11023,'PÃ©njamo',11),(11024,'Pueblo Nuevo',11),(11025,'PurÃ­sima del RincÃ³n',11),(11026,'Romita',11),(11027,'Salamanca',11),(11028,'Salvatierra',11),(11029,'San Diego de la UniÃ³n',11),(11030,'San Felipe',11),(11031,'San Francisco del RincÃ³n',11),(11032,'San JosÃ© Iturbide',11),(11033,'San Luis de la Paz',11),(11034,'Santa Catarina',11),(11035,'Santa Cruz de Juventino Rosas',11),(11036,'Santiago MaravatÃ­o',11),(11037,'Silao de la Victoria',11),(11038,'Tarandacuao',11),(11039,'Tarimoro',11),(11040,'Tierra Blanca',11),(11041,'Uriangato',11),(11042,'Valle de Santiago',11),(11043,'Victoria',11),(11044,'VillagrÃ¡n',11),(11045,'XichÃº',11),(11046,'Yuriria',11),(12001,'Acapulco de JuÃ¡rez',12),(12002,'Ahuacuotzingo',12),(12003,'AjuchitlÃ¡n del Progreso',12),(12004,'Alcozauca de Guerrero',12),(12005,'Alpoyeca',12),(12006,'Apaxtla',12),(12007,'Arcelia',12),(12008,'Atenango del RÃ­o',12),(12009,'Atlamajalcingo del Monte',12),(12010,'Atlixtac',12),(12011,'Atoyac de Ãlvarez',12),(12012,'Ayutla de los Libres',12),(12013,'AzoyÃº',12),(12014,'Benito JuÃ¡rez',12),(12015,'Buenavista de CuÃ©llar',12),(12016,'Coahuayutla de JosÃ© MarÃ­a Izazaga',12),(12017,'Cocula',12),(12018,'Copala',12),(12019,'Copalillo',12),(12020,'Copanatoyac',12),(12021,'Coyuca de BenÃ­tez',12),(12022,'Coyuca de CatalÃ¡n',12),(12023,'Cuajinicuilapa',12),(12024,'CualÃ¡c',12),(12025,'Cuautepec',12),(12026,'Cuetzala del Progreso',12),(12027,'Cutzamala de PinzÃ³n',12),(12028,'Chilapa de Ãlvarez',12),(12029,'Chilpancingo de los Bravo',12),(12030,'Florencio Villarreal',12),(12031,'General Canuto A. Neri',12),(12032,'General Heliodoro Castillo',12),(12033,'HuamuxtitlÃ¡n',12),(12034,'Huitzuco de los Figueroa',12),(12035,'Iguala de la Independencia',12),(12036,'Igualapa',12),(12037,'Ixcateopan de CuauhtÃ©moc',12),(12038,'Zihuatanejo de Azueta',12),(12039,'Juan R. Escudero',12),(12040,'Leonardo Bravo',12),(12041,'Malinaltepec',12),(12042,'MÃ¡rtir de Cuilapan',12),(12043,'MetlatÃ³noc',12),(12044,'MochitlÃ¡n',12),(12045,'OlinalÃ¡',12),(12046,'Ometepec',12),(12047,'Pedro Ascencio Alquisiras',12),(12048,'PetatlÃ¡n',12),(12049,'Pilcaya',12),(12050,'Pungarabato',12),(12051,'Quechultenango',12),(12052,'San Luis AcatlÃ¡n',12),(12053,'San Marcos',12),(12054,'San Miguel Totolapan',12),(12055,'Taxco de AlarcÃ³n',12),(12056,'Tecoanapa',12),(12057,'TÃ©cpan de Galeana',12),(12058,'Teloloapan',12),(12059,'Tepecoacuilco de Trujano',12),(12060,'Tetipac',12),(12061,'Tixtla de Guerrero',12),(12062,'Tlacoachistlahuaca',12),(12063,'Tlacoapa',12),(12064,'Tlalchapa',12),(12065,'Tlalixtaquilla de Maldonado',12),(12066,'Tlapa de Comonfort',12),(12067,'Tlapehuala',12),(12068,'La UniÃ³n de Isidoro Montes de Oca',12),(12069,'XalpatlÃ¡huac',12),(12070,'XochihuehuetlÃ¡n',12),(12071,'Xochistlahuaca',12),(12072,'ZapotitlÃ¡n Tablas',12),(12073,'ZirÃ¡ndaro',12),(12074,'Zitlala',12),(12075,'Eduardo Neri',12),(12076,'Acatepec',12),(12077,'Marquelia',12),(12078,'Cochoapa el Grande',12),(12079,'JosÃ© JoaquÃ­n de Herrera',12),(12080,'JuchitÃ¡n',12),(12081,'Iliatenco',12),(13001,'AcatlÃ¡n',13),(13002,'AcaxochitlÃ¡n',13),(13003,'Actopan',13),(13004,'Agua Blanca de Iturbide',13),(13005,'Ajacuba',13),(13006,'Alfajayucan',13),(13007,'Almoloya',13),(13008,'Apan',13),(13009,'El Arenal',13),(13010,'Atitalaquia',13),(13011,'Atlapexco',13),(13012,'Atotonilco el Grande',13),(13013,'Atotonilco de Tula',13),(13014,'Calnali',13),(13015,'Cardonal',13),(13016,'Cuautepec de Hinojosa',13),(13017,'Chapantongo',13),(13018,'ChapulhuacÃ¡n',13),(13019,'Chilcuautla',13),(13020,'EloxochitlÃ¡n',13),(13021,'Emiliano Zapata',13),(13022,'Epazoyucan',13),(13023,'Francisco I. Madero',13),(13024,'Huasca de Ocampo',13),(13025,'Huautla',13),(13026,'Huazalingo',13),(13027,'Huehuetla',13),(13028,'Huejutla de Reyes',13),(13029,'Huichapan',13),(13030,'Ixmiquilpan',13),(13031,'Jacala de Ledezma',13),(13032,'JaltocÃ¡n',13),(13033,'JuÃ¡rez Hidalgo',13),(13034,'Lolotla',13),(13035,'Metepec',13),(13036,'San AgustÃ­n MetzquititlÃ¡n',13),(13037,'MetztitlÃ¡n',13),(13038,'Mineral del Chico',13),(13039,'Mineral del Monte',13),(13040,'La MisiÃ³n',13),(13041,'Mixquiahuala de JuÃ¡rez',13),(13042,'Molango de Escamilla',13),(13043,'NicolÃ¡s Flores',13),(13044,'Nopala de VillagrÃ¡n',13),(13045,'OmitlÃ¡n de JuÃ¡rez',13),(13046,'San Felipe OrizatlÃ¡n',13),(13047,'Pacula',13),(13048,'Pachuca de Soto',13),(13049,'Pisaflores',13),(13050,'Progreso de ObregÃ³n',13),(13051,'Mineral de la Reforma',13),(13052,'San AgustÃ­n Tlaxiaca',13),(13053,'San Bartolo Tutotepec',13),(13054,'San Salvador',13),(13055,'Santiago de Anaya',13),(13056,'Santiago Tulantepec de Lugo Guerrero',13),(13057,'Singuilucan',13),(13058,'Tasquillo',13),(13059,'Tecozautla',13),(13060,'Tenango de Doria',13),(13061,'Tepeapulco',13),(13062,'TepehuacÃ¡n de Guerrero',13),(13063,'Tepeji del RÃ­o de Ocampo',13),(13064,'TepetitlÃ¡n',13),(13065,'Tetepango',13),(13066,'Villa de Tezontepec',13),(13067,'Tezontepec de Aldama',13),(13068,'Tianguistengo',13),(13069,'Tizayuca',13),(13070,'Tlahuelilpan',13),(13071,'Tlahuiltepa',13),(13072,'Tlanalapa',13),(13073,'Tlanchinol',13),(13074,'Tlaxcoapan',13),(13075,'Tolcayuca',13),(13076,'Tula de Allende',13),(13077,'Tulancingo de Bravo',13),(13078,'Xochiatipan',13),(13079,'XochicoatlÃ¡n',13),(13080,'Yahualica',13),(13081,'ZacualtipÃ¡n de Ãngeles',13),(13082,'ZapotlÃ¡n de JuÃ¡rez',13),(13083,'Zempoala',13),(13084,'ZimapÃ¡n',13),(14001,'Acatic',14),(14002,'AcatlÃ¡n de JuÃ¡rez',14),(14003,'Ahualulco de Mercado',14),(14004,'Amacueca',14),(14005,'AmatitÃ¡n',14),(14006,'Ameca',14),(14007,'San Juanito de Escobedo',14),(14008,'Arandas',14),(14009,'El Arenal',14),(14010,'Atemajac de Brizuela',14),(14011,'Atengo',14),(14012,'Atenguillo',14),(14013,'Atotonilco el Alto',14),(14014,'Atoyac',14),(14015,'AutlÃ¡n de Navarro',14),(14016,'AyotlÃ¡n',14),(14017,'Ayutla',14),(14018,'La Barca',14),(14019,'BolaÃ±os',14),(14020,'Cabo Corrientes',14),(14021,'Casimiro Castillo',14),(14022,'CihuatlÃ¡n',14),(14023,'ZapotlÃ¡n el Grande',14),(14024,'Cocula',14),(14025,'ColotlÃ¡n',14),(14026,'ConcepciÃ³n de Buenos Aires',14),(14027,'CuautitlÃ¡n de GarcÃ­a BarragÃ¡n',14),(14028,'Cuautla',14),(14029,'CuquÃ­o',14),(14030,'Chapala',14),(14031,'ChimaltitÃ¡n',14),(14032,'ChiquilistlÃ¡n',14),(14033,'Degollado',14),(14034,'Ejutla',14),(14035,'EncarnaciÃ³n de DÃ­az',14),(14036,'EtzatlÃ¡n',14),(14037,'El Grullo',14),(14038,'Guachinango',14),(14039,'Guadalajara',14),(14040,'Hostotipaquillo',14),(14041,'HuejÃºcar',14),(14042,'Huejuquilla el Alto',14),(14043,'La Huerta',14),(14044,'IxtlahuacÃ¡n de los Membrillos',14),(14045,'IxtlahuacÃ¡n del RÃ­o',14),(14046,'JalostotitlÃ¡n',14),(14047,'Jamay',14),(14048,'JesÃºs MarÃ­a',14),(14049,'JilotlÃ¡n de los Dolores',14),(14050,'Jocotepec',14),(14051,'JuanacatlÃ¡n',14),(14052,'JuchitlÃ¡n',14),(14053,'Lagos de Moreno',14),(14054,'El LimÃ³n',14),(14055,'Magdalena',14),(14056,'Santa MarÃ­a del Oro',14),(14057,'La Manzanilla de la Paz',14),(14058,'Mascota',14),(14059,'Mazamitla',14),(14060,'MexticacÃ¡n',14),(14061,'Mezquitic',14),(14062,'MixtlÃ¡n',14),(14063,'OcotlÃ¡n',14),(14064,'Ojuelos de Jalisco',14),(14065,'Pihuamo',14),(14066,'PoncitlÃ¡n',14),(14067,'Puerto Vallarta',14),(14068,'Villa PurificaciÃ³n',14),(14069,'Quitupan',14),(14070,'El Salto',14),(14071,'San CristÃ³bal de la Barranca',14),(14072,'San Diego de AlejandrÃ­a',14),(14073,'San Juan de los Lagos',14),(14074,'San JuliÃ¡n',14),(14075,'San Marcos',14),(14076,'San MartÃ­n de BolaÃ±os',14),(14077,'San MartÃ­n Hidalgo',14),(14078,'San Miguel el Alto',14),(14079,'GÃ³mez FarÃ­as',14),(14080,'San SebastiÃ¡n del Oeste',14),(14081,'Santa MarÃ­a de los Ãngeles',14),(14082,'Sayula',14),(14083,'Tala',14),(14084,'Talpa de Allende',14),(14085,'Tamazula de Gordiano',14),(14086,'Tapalpa',14),(14087,'TecalitlÃ¡n',14),(14088,'TecolotlÃ¡n',14),(14089,'Techaluta de Montenegro',14),(14090,'TenamaxtlÃ¡n',14),(14091,'Teocaltiche',14),(14092,'TeocuitatlÃ¡n de Corona',14),(14093,'TepatitlÃ¡n de Morelos',14),(14094,'Tequila',14),(14095,'TeuchitlÃ¡n',14),(14096,'TizapÃ¡n el Alto',14),(14097,'Tlajomulco de ZÃºÃ±iga',14),(14098,'San Pedro Tlaquepaque',14),(14099,'TolimÃ¡n',14),(14100,'TomatlÃ¡n',14),(14101,'TonalÃ¡',14),(14102,'Tonaya',14),(14103,'Tonila',14),(14104,'Totatiche',14),(14105,'TototlÃ¡n',14),(14106,'Tuxcacuesco',14),(14107,'Tuxcueca',14),(14108,'Tuxpan',14),(14109,'UniÃ³n de San Antonio',14),(14110,'UniÃ³n de Tula',14),(14111,'Valle de Guadalupe',14),(14112,'Valle de JuÃ¡rez',14),(14113,'San Gabriel',14),(14114,'Villa Corona',14),(14115,'Villa Guerrero',14),(14116,'Villa Hidalgo',14),(14117,'CaÃ±adas de ObregÃ³n',14),(14118,'Yahualica de GonzÃ¡lez Gallo',14),(14119,'Zacoalco de Torres',14),(14120,'Zapopan',14),(14121,'Zapotiltic',14),(14122,'ZapotitlÃ¡n de Vadillo',14),(14123,'ZapotlÃ¡n del Rey',14),(14124,'Zapotlanejo',14),(14125,'San Ignacio Cerro Gordo',14),(15001,'Acambay de RuÃ­z CastaÃ±eda',15),(15002,'Acolman',15),(15003,'Aculco',15),(15004,'Almoloya de Alquisiras',15),(15005,'Almoloya de JuÃ¡rez',15),(15006,'Almoloya del RÃ­o',15),(15007,'Amanalco',15),(15008,'Amatepec',15),(15009,'Amecameca',15),(15010,'Apaxco',15),(15011,'Atenco',15),(15012,'AtizapÃ¡n',15),(15013,'AtizapÃ¡n de Zaragoza',15),(15014,'Atlacomulco',15),(15015,'Atlautla',15),(15016,'Axapusco',15),(15017,'Ayapango',15),(15018,'Calimaya',15),(15019,'Capulhuac',15),(15020,'Coacalco de BerriozÃ¡bal',15),(15021,'Coatepec Harinas',15),(15022,'CocotitlÃ¡n',15),(15023,'Coyotepec',15),(15024,'CuautitlÃ¡n',15),(15025,'Chalco',15),(15026,'Chapa de Mota',15),(15027,'Chapultepec',15),(15028,'Chiautla',15),(15029,'Chicoloapan',15),(15030,'Chiconcuac',15),(15031,'ChimalhuacÃ¡n',15),(15032,'Donato Guerra',15),(15033,'Ecatepec de Morelos',15),(15034,'Ecatzingo',15),(15035,'Huehuetoca',15),(15036,'Hueypoxtla',15),(15037,'Huixquilucan',15),(15038,'Isidro Fabela',15),(15039,'Ixtapaluca',15),(15040,'Ixtapan de la Sal',15),(15041,'Ixtapan del Oro',15),(15042,'Ixtlahuaca',15),(15043,'Xalatlaco',15),(15044,'Jaltenco',15),(15045,'Jilotepec',15),(15046,'Jilotzingo',15),(15047,'Jiquipilco',15),(15048,'JocotitlÃ¡n',15),(15049,'Joquicingo',15),(15050,'Juchitepec',15),(15051,'Lerma',15),(15052,'Malinalco',15),(15053,'Melchor Ocampo',15),(15054,'Metepec',15),(15055,'Mexicaltzingo',15),(15056,'Morelos',15),(15057,'Naucalpan de JuÃ¡rez',15),(15058,'NezahualcÃ³yotl',15),(15059,'Nextlalpan',15),(15060,'NicolÃ¡s Romero',15),(15061,'Nopaltepec',15),(15062,'Ocoyoacac',15),(15063,'Ocuilan',15),(15064,'El Oro',15),(15065,'Otumba',15),(15066,'Otzoloapan',15),(15067,'Otzolotepec',15),(15068,'Ozumba',15),(15069,'Papalotla',15),(15070,'La Paz',15),(15071,'PolotitlÃ¡n',15),(15072,'RayÃ³n',15),(15073,'San Antonio la Isla',15),(15074,'San Felipe del Progreso',15),(15075,'San MartÃ­n de las PirÃ¡mides',15),(15076,'San Mateo Atenco',15),(15077,'San SimÃ³n de Guerrero',15),(15078,'Santo TomÃ¡s',15),(15079,'Soyaniquilpan de JuÃ¡rez',15),(15080,'Sultepec',15),(15081,'TecÃ¡mac',15),(15082,'Tejupilco',15),(15083,'Temamatla',15),(15084,'Temascalapa',15),(15085,'Temascalcingo',15),(15086,'Temascaltepec',15),(15087,'Temoaya',15),(15088,'Tenancingo',15),(15089,'Tenango del Aire',15),(15090,'Tenango del Valle',15),(15091,'Teoloyucan',15),(15092,'TeotihuacÃ¡n',15),(15093,'Tepetlaoxtoc',15),(15094,'Tepetlixpa',15),(15095,'TepotzotlÃ¡n',15),(15096,'Tequixquiac',15),(15097,'TexcaltitlÃ¡n',15),(15098,'Texcalyacac',15),(15099,'Texcoco',15),(15100,'Tezoyuca',15),(15101,'Tianguistenco',15),(15102,'Timilpan',15),(15103,'Tlalmanalco',15),(15104,'Tlalnepantla de Baz',15),(15105,'Tlatlaya',15),(15106,'Toluca',15),(15107,'Tonatico',15),(15108,'Tultepec',15),(15109,'TultitlÃ¡n',15),(15110,'Valle de Bravo',15),(15111,'Villa de Allende',15),(15112,'Villa del CarbÃ³n',15),(15113,'Villa Guerrero',15),(15114,'Villa Victoria',15),(15115,'XonacatlÃ¡n',15),(15116,'Zacazonapan',15),(15117,'Zacualpan',15),(15118,'Zinacantepec',15),(15119,'ZumpahuacÃ¡n',15),(15120,'Zumpango',15),(15121,'CuautitlÃ¡n Izcalli',15),(15122,'Valle de Chalco Solidaridad',15),(15123,'Luvianos',15),(15124,'San JosÃ© del RincÃ³n',15),(15125,'Tonanitla',15),(16001,'Acuitzio',16),(16002,'Aguililla',16),(16003,'Ãlvaro ObregÃ³n',16),(16004,'Angamacutiro',16),(16005,'Angangueo',16),(16006,'ApatzingÃ¡n',16),(16007,'Aporo',16),(16008,'Aquila',16),(16009,'Ario',16),(16010,'Arteaga',16),(16011,'BriseÃ±as',16),(16012,'Buenavista',16),(16013,'CarÃ¡cuaro',16),(16014,'Coahuayana',16),(16015,'CoalcomÃ¡n de VÃ¡zquez Pallares',16),(16016,'Coeneo',16),(16017,'Contepec',16),(16018,'CopÃ¡ndaro',16),(16019,'Cotija',16),(16020,'Cuitzeo',16),(16021,'Charapan',16),(16022,'Charo',16),(16023,'Chavinda',16),(16024,'CherÃ¡n',16),(16025,'Chilchota',16),(16026,'Chinicuila',16),(16027,'ChucÃ¡ndiro',16),(16028,'Churintzio',16),(16029,'Churumuco',16),(16030,'Ecuandureo',16),(16031,'Epitacio Huerta',16),(16032,'ErongarÃ­cuaro',16),(16033,'Gabriel Zamora',16),(16034,'Hidalgo',16),(16035,'La Huacana',16),(16036,'Huandacareo',16),(16037,'Huaniqueo',16),(16038,'Huetamo',16),(16039,'Huiramba',16),(16040,'Indaparapeo',16),(16041,'Irimbo',16),(16042,'IxtlÃ¡n',16),(16043,'Jacona',16),(16044,'JimÃ©nez',16),(16045,'Jiquilpan',16),(16046,'JuÃ¡rez',16),(16047,'Jungapeo',16),(16048,'Lagunillas',16),(16049,'Madero',16),(16050,'MaravatÃ­o',16),(16051,'Marcos Castellanos',16),(16052,'LÃ¡zaro CÃ¡rdenas',16),(16053,'Morelia',16),(16054,'Morelos',16),(16055,'MÃºgica',16),(16056,'Nahuatzen',16),(16057,'NocupÃ©taro',16),(16058,'Nuevo Parangaricutiro',16),(16059,'Nuevo Urecho',16),(16060,'NumarÃ¡n',16),(16061,'Ocampo',16),(16062,'PajacuarÃ¡n',16),(16063,'PanindÃ­cuaro',16),(16064,'ParÃ¡cuaro',16),(16065,'Paracho',16),(16066,'PÃ¡tzcuaro',16),(16067,'Penjamillo',16),(16068,'PeribÃ¡n',16),(16069,'La Piedad',16),(16070,'PurÃ©pero',16),(16071,'PuruÃ¡ndiro',16),(16072,'QuerÃ©ndaro',16),(16073,'Quiroga',16),(16074,'CojumatlÃ¡n de RÃ©gules',16),(16075,'Los Reyes',16),(16076,'Sahuayo',16),(16077,'San Lucas',16),(16078,'Santa Ana Maya',16),(16079,'Salvador Escalante',16),(16080,'Senguio',16),(16081,'Susupuato',16),(16082,'TacÃ¡mbaro',16),(16083,'TancÃ­taro',16),(16084,'Tangamandapio',16),(16085,'TangancÃ­cuaro',16),(16086,'Tanhuato',16),(16087,'Taretan',16),(16088,'TarÃ­mbaro',16),(16089,'Tepalcatepec',16),(16090,'Tingambato',16),(16091,'TingÃ¼indÃ­n',16),(16092,'Tiquicheo de NicolÃ¡s Romero',16),(16093,'Tlalpujahua',16),(16094,'Tlazazalca',16),(16095,'Tocumbo',16),(16096,'TumbiscatÃ­o',16),(16097,'Turicato',16),(16098,'Tuxpan',16),(16099,'Tuzantla',16),(16100,'Tzintzuntzan',16),(16101,'Tzitzio',16),(16102,'Uruapan',16),(16103,'Venustiano Carranza',16),(16104,'Villamar',16),(16105,'Vista Hermosa',16),(16106,'YurÃ©cuaro',16),(16107,'Zacapu',16),(16108,'Zamora',16),(16109,'ZinÃ¡paro',16),(16110,'ZinapÃ©cuaro',16),(16111,'Ziracuaretiro',16),(16112,'ZitÃ¡cuaro',16),(16113,'JosÃ© Sixto Verduzco',16),(17001,'Amacuzac',17),(17002,'Atlatlahucan',17),(17003,'Axochiapan',17),(17004,'Ayala',17),(17005,'CoatlÃ¡n del RÃ­o',17),(17006,'Cuautla',17),(17007,'Cuernavaca',17),(17008,'Emiliano Zapata',17),(17009,'Huitzilac',17),(17010,'Jantetelco',17),(17011,'Jiutepec',17),(17012,'Jojutla',17),(17013,'Jonacatepec de Leandro Valle',17),(17014,'Mazatepec',17),(17015,'MiacatlÃ¡n',17),(17016,'Ocuituco',17),(17017,'Puente de Ixtla',17),(17018,'Temixco',17),(17019,'Tepalcingo',17),(17020,'TepoztlÃ¡n',17),(17021,'Tetecala',17),(17022,'Tetela del VolcÃ¡n',17),(17023,'Tlalnepantla',17),(17024,'TlaltizapÃ¡n de Zapata',17),(17025,'Tlaquiltenango',17),(17026,'Tlayacapan',17),(17027,'Totolapan',17),(17028,'Xochitepec',17),(17029,'Yautepec',17),(17030,'Yecapixtla',17),(17031,'Zacatepec',17),(17032,'Zacualpan de Amilpas',17),(17033,'Temoac',17),(17034,'Coatetelco',17),(17035,'Xoxocotla',17),(18001,'Acaponeta',18),(18002,'AhuacatlÃ¡n',18),(18003,'AmatlÃ¡n de CaÃ±as',18),(18004,'Compostela',18),(18005,'Huajicori',18),(18006,'IxtlÃ¡n del RÃ­o',18),(18007,'Jala',18),(18008,'Xalisco',18),(18009,'Del Nayar',18),(18010,'Rosamorada',18),(18011,'RuÃ­z',18),(18012,'San Blas',18),(18013,'San Pedro Lagunillas',18),(18014,'Santa MarÃ­a del Oro',18),(18015,'Santiago Ixcuintla',18),(18016,'Tecuala',18),(18017,'Tepic',18),(18018,'Tuxpan',18),(18019,'La Yesca',18),(18020,'BahÃ­a de Banderas',18),(19001,'Abasolo',19),(19002,'Agualeguas',19),(19003,'Los Aldamas',19),(19004,'Allende',19),(19005,'AnÃ¡huac',19),(19006,'Apodaca',19),(19007,'Aramberri',19),(19008,'Bustamante',19),(19009,'Cadereyta JimÃ©nez',19),(19010,'El Carmen',19),(19011,'Cerralvo',19),(19012,'CiÃ©nega de Flores',19),(19013,'China',19),(19014,'Doctor Arroyo',19),(19015,'Doctor Coss',19),(19016,'Doctor GonzÃ¡lez',19),(19017,'Galeana',19),(19018,'GarcÃ­a',19),(19019,'San Pedro Garza GarcÃ­a',19),(19020,'General Bravo',19),(19021,'General Escobedo',19),(19022,'General TerÃ¡n',19),(19023,'General TreviÃ±o',19),(19024,'General Zaragoza',19),(19025,'General Zuazua',19),(19026,'Guadalupe',19),(19027,'Los Herreras',19),(19028,'Higueras',19),(19029,'Hualahuises',19),(19030,'Iturbide',19),(19031,'JuÃ¡rez',19),(19032,'Lampazos de Naranjo',19),(19033,'Linares',19),(19034,'MarÃ­n',19),(19035,'Melchor Ocampo',19),(19036,'Mier y Noriega',19),(19037,'Mina',19),(19038,'Montemorelos',19),(19039,'Monterrey',19),(19040,'ParÃ¡s',19),(19041,'PesquerÃ­a',19),(19042,'Los Ramones',19),(19043,'Rayones',19),(19044,'Sabinas Hidalgo',19),(19045,'Salinas Victoria',19),(19046,'San NicolÃ¡s de los Garza',19),(19047,'Hidalgo',19),(19048,'Santa Catarina',19),(19049,'Santiago',19),(19050,'Vallecillo',19),(19051,'Villaldama',19),(20001,'Abejones',20),(20002,'AcatlÃ¡n de PÃ©rez Figueroa',20),(20003,'AsunciÃ³n Cacalotepec',20),(20004,'AsunciÃ³n Cuyotepeji',20),(20005,'AsunciÃ³n Ixtaltepec',20),(20006,'AsunciÃ³n NochixtlÃ¡n',20),(20007,'AsunciÃ³n OcotlÃ¡n',20),(20008,'AsunciÃ³n Tlacolulita',20),(20009,'Ayotzintepec',20),(20010,'El Barrio de la Soledad',20),(20011,'CalihualÃ¡',20),(20012,'Candelaria Loxicha',20),(20013,'CiÃ©nega de ZimatlÃ¡n',20),(20014,'Ciudad Ixtepec',20),(20015,'Coatecas Altas',20),(20016,'CoicoyÃ¡n de las Flores',20),(20017,'La CompaÃ±Ã­a',20),(20018,'ConcepciÃ³n Buenavista',20),(20019,'ConcepciÃ³n PÃ¡palo',20),(20020,'Constancia del Rosario',20),(20021,'Cosolapa',20),(20022,'Cosoltepec',20),(20023,'CuilÃ¡pam de Guerrero',20),(20024,'Cuyamecalco Villa de Zaragoza',20),(20025,'Chahuites',20),(20026,'Chalcatongo de Hidalgo',20),(20027,'ChiquihuitlÃ¡n de Benito JuÃ¡rez',20),(20028,'Heroica Ciudad de Ejutla de Crespo',20),(20029,'EloxochitlÃ¡n de Flores MagÃ³n',20),(20030,'El Espinal',20),(20031,'TamazulÃ¡pam del EspÃ­ritu Santo',20),(20032,'Fresnillo de Trujano',20),(20033,'Guadalupe Etla',20),(20034,'Guadalupe de RamÃ­rez',20),(20035,'Guelatao de JuÃ¡rez',20),(20036,'Guevea de Humboldt',20),(20037,'Mesones Hidalgo',20),(20038,'Villa Hidalgo',20),(20039,'Heroica Ciudad de Huajuapan de LeÃ³n',20),(20040,'Huautepec',20),(20041,'Huautla de JimÃ©nez',20),(20042,'IxtlÃ¡n de JuÃ¡rez',20),(20043,'Heroica Ciudad de JuchitÃ¡n de Zaragoza',20),(20044,'Loma Bonita',20),(20045,'Magdalena Apasco',20),(20046,'Magdalena Jaltepec',20),(20047,'Santa Magdalena JicotlÃ¡n',20),(20048,'Magdalena Mixtepec',20),(20049,'Magdalena OcotlÃ¡n',20),(20050,'Magdalena PeÃ±asco',20),(20051,'Magdalena Teitipac',20),(20052,'Magdalena TequisistlÃ¡n',20),(20053,'Magdalena Tlacotepec',20),(20054,'Magdalena ZahuatlÃ¡n',20),(20055,'Mariscala de JuÃ¡rez',20),(20056,'MÃ¡rtires de Tacubaya',20),(20057,'MatÃ­as Romero AvendaÃ±o',20),(20058,'MazatlÃ¡n Villa de Flores',20),(20059,'MiahuatlÃ¡n de Porfirio DÃ­az',20),(20060,'MixistlÃ¡n de la Reforma',20),(20061,'Monjas',20),(20062,'Natividad',20),(20063,'Nazareno Etla',20),(20064,'Nejapa de Madero',20),(20065,'Ixpantepec Nieves',20),(20066,'Santiago Niltepec',20),(20067,'Oaxaca de JuÃ¡rez',20),(20068,'OcotlÃ¡n de Morelos',20),(20069,'La Pe',20),(20070,'Pinotepa de Don Luis',20),(20071,'Pluma Hidalgo',20),(20072,'San JosÃ© del Progreso',20),(20073,'Putla Villa de Guerrero',20),(20074,'Santa Catarina Quioquitani',20),(20075,'Reforma de Pineda',20),(20076,'La Reforma',20),(20077,'Reyes Etla',20),(20078,'Rojas de CuauhtÃ©moc',20),(20079,'Salina Cruz',20),(20080,'San AgustÃ­n Amatengo',20),(20081,'San AgustÃ­n Atenango',20),(20082,'San AgustÃ­n Chayuco',20),(20083,'San AgustÃ­n de las Juntas',20),(20084,'San AgustÃ­n Etla',20),(20085,'San AgustÃ­n Loxicha',20),(20086,'San AgustÃ­n Tlacotepec',20),(20087,'San AgustÃ­n Yatareni',20),(20088,'San AndrÃ©s Cabecera Nueva',20),(20089,'San AndrÃ©s Dinicuiti',20),(20090,'San AndrÃ©s Huaxpaltepec',20),(20091,'San AndrÃ©s HuayÃ¡pam',20),(20092,'San AndrÃ©s Ixtlahuaca',20),(20093,'San AndrÃ©s Lagunas',20),(20094,'San AndrÃ©s NuxiÃ±o',20),(20095,'San AndrÃ©s PaxtlÃ¡n',20),(20096,'San AndrÃ©s Sinaxtla',20),(20097,'San AndrÃ©s Solaga',20),(20098,'San AndrÃ©s TeotilÃ¡lpam',20),(20099,'San AndrÃ©s Tepetlapa',20),(20100,'San AndrÃ©s YaÃ¡',20),(20101,'San AndrÃ©s Zabache',20),(20102,'San AndrÃ©s Zautla',20),(20103,'San Antonino Castillo Velasco',20),(20104,'San Antonino el Alto',20),(20105,'San Antonino Monte Verde',20),(20106,'San Antonio Acutla',20),(20107,'San Antonio de la Cal',20),(20108,'San Antonio Huitepec',20),(20109,'San Antonio NanahuatÃ­pam',20),(20110,'San Antonio Sinicahua',20),(20111,'San Antonio Tepetlapa',20),(20112,'San Baltazar ChichicÃ¡pam',20),(20113,'San Baltazar Loxicha',20),(20114,'San Baltazar Yatzachi el Bajo',20),(20115,'San Bartolo Coyotepec',20),(20116,'San BartolomÃ© Ayautla',20),(20117,'San BartolomÃ© Loxicha',20),(20118,'San BartolomÃ© Quialana',20),(20119,'San BartolomÃ© YucuaÃ±e',20),(20120,'San BartolomÃ© Zoogocho',20),(20121,'San Bartolo Soyaltepec',20),(20122,'San Bartolo Yautepec',20),(20123,'San Bernardo Mixtepec',20),(20124,'San Blas Atempa',20),(20125,'San Carlos Yautepec',20),(20126,'San CristÃ³bal AmatlÃ¡n',20),(20127,'San CristÃ³bal Amoltepec',20),(20128,'San CristÃ³bal Lachirioag',20),(20129,'San CristÃ³bal Suchixtlahuaca',20),(20130,'San Dionisio del Mar',20),(20131,'San Dionisio Ocotepec',20),(20132,'San Dionisio OcotlÃ¡n',20),(20133,'San Esteban Atatlahuca',20),(20134,'San Felipe Jalapa de DÃ­az',20),(20135,'San Felipe TejalÃ¡pam',20),(20136,'San Felipe Usila',20),(20137,'San Francisco CahuacuÃ¡',20),(20138,'San Francisco Cajonos',20),(20139,'San Francisco Chapulapa',20),(20140,'San Francisco ChindÃºa',20),(20141,'San Francisco del Mar',20),(20142,'San Francisco HuehuetlÃ¡n',20),(20143,'San Francisco IxhuatÃ¡n',20),(20144,'San Francisco Jaltepetongo',20),(20145,'San Francisco LachigolÃ³',20),(20146,'San Francisco Logueche',20),(20147,'San Francisco NuxaÃ±o',20),(20148,'San Francisco Ozolotepec',20),(20149,'San Francisco Sola',20),(20150,'San Francisco Telixtlahuaca',20),(20151,'San Francisco Teopan',20),(20152,'San Francisco Tlapancingo',20),(20153,'San Gabriel Mixtepec',20),(20154,'San Ildefonso AmatlÃ¡n',20),(20155,'San Ildefonso Sola',20),(20156,'San Ildefonso Villa Alta',20),(20157,'San Jacinto Amilpas',20),(20158,'San Jacinto Tlacotepec',20),(20159,'San JerÃ³nimo CoatlÃ¡n',20),(20160,'San JerÃ³nimo Silacayoapilla',20),(20161,'San JerÃ³nimo Sosola',20),(20162,'San JerÃ³nimo Taviche',20),(20163,'San JerÃ³nimo TecÃ³atl',20),(20164,'San Jorge Nuchita',20),(20165,'San JosÃ© Ayuquila',20),(20166,'San JosÃ© Chiltepec',20),(20167,'San JosÃ© del PeÃ±asco',20),(20168,'San JosÃ© Estancia Grande',20),(20169,'San JosÃ© Independencia',20),(20170,'San JosÃ© Lachiguiri',20),(20171,'San JosÃ© Tenango',20),(20172,'San Juan Achiutla',20),(20173,'San Juan Atepec',20),(20174,'Ãnimas Trujano',20),(20175,'San Juan Bautista Atatlahuca',20),(20176,'San Juan Bautista Coixtlahuaca',20),(20177,'San Juan Bautista CuicatlÃ¡n',20),(20178,'San Juan Bautista Guelache',20),(20179,'San Juan Bautista JayacatlÃ¡n',20),(20180,'San Juan Bautista Lo de Soto',20),(20181,'San Juan Bautista Suchitepec',20),(20182,'San Juan Bautista Tlacoatzintepec',20),(20183,'San Juan Bautista Tlachichilco',20),(20184,'San Juan Bautista Tuxtepec',20),(20185,'San Juan Cacahuatepec',20),(20186,'San Juan Cieneguilla',20),(20187,'San Juan CoatzÃ³spam',20),(20188,'San Juan Colorado',20),(20189,'San Juan Comaltepec',20),(20190,'San Juan CotzocÃ³n',20),(20191,'San Juan ChicomezÃºchil',20),(20192,'San Juan Chilateca',20),(20193,'San Juan del Estado',20),(20194,'San Juan del RÃ­o',20),(20195,'San Juan Diuxi',20),(20196,'San Juan Evangelista Analco',20),(20197,'San Juan GuelavÃ­a',20),(20198,'San Juan Guichicovi',20),(20199,'San Juan Ihualtepec',20),(20200,'San Juan Juquila Mixes',20),(20201,'San Juan Juquila Vijanos',20),(20202,'San Juan Lachao',20),(20203,'San Juan Lachigalla',20),(20204,'San Juan Lajarcia',20),(20205,'San Juan Lalana',20),(20206,'San Juan de los CuÃ©s',20),(20207,'San Juan MazatlÃ¡n',20),(20208,'San Juan Mixtepec -Dto. 08 -',20),(20209,'San Juan Mixtepec -Dto. 26 -',20),(20210,'San Juan ÃumÃ­',20),(20211,'San Juan Ozolotepec',20),(20212,'San Juan Petlapa',20),(20213,'San Juan Quiahije',20),(20214,'San Juan Quiotepec',20),(20215,'San Juan Sayultepec',20),(20216,'San Juan TabaÃ¡',20),(20217,'San Juan Tamazola',20),(20218,'San Juan Teita',20),(20219,'San Juan Teitipac',20),(20220,'San Juan Tepeuxila',20),(20221,'San Juan Teposcolula',20),(20222,'San Juan YaeÃ©',20),(20223,'San Juan Yatzona',20),(20224,'San Juan Yucuita',20),(20225,'San Lorenzo',20),(20226,'San Lorenzo Albarradas',20),(20227,'San Lorenzo Cacaotepec',20),(20228,'San Lorenzo Cuaunecuiltitla',20),(20229,'San Lorenzo TexmelÃºcan',20),(20230,'San Lorenzo Victoria',20),(20231,'San Lucas CamotlÃ¡n',20),(20232,'San Lucas OjitlÃ¡n',20),(20233,'San Lucas QuiavinÃ­',20),(20234,'San Lucas ZoquiÃ¡pam',20),(20235,'San Luis AmatlÃ¡n',20),(20236,'San Marcial Ozolotepec',20),(20237,'San Marcos Arteaga',20),(20238,'San MartÃ­n de los Cansecos',20),(20239,'San MartÃ­n HuamelÃºlpam',20),(20240,'San MartÃ­n Itunyoso',20),(20241,'San MartÃ­n LachilÃ¡',20),(20242,'San MartÃ­n Peras',20),(20243,'San MartÃ­n Tilcajete',20),(20244,'San MartÃ­n Toxpalan',20),(20245,'San MartÃ­n Zacatepec',20),(20246,'San Mateo Cajonos',20),(20247,'CapulÃ¡lpam de MÃ©ndez',20),(20248,'San Mateo del Mar',20),(20249,'San Mateo YoloxochitlÃ¡n',20),(20250,'San Mateo Etlatongo',20),(20251,'San Mateo NejÃ¡pam',20),(20252,'San Mateo PeÃ±asco',20),(20253,'San Mateo PiÃ±as',20),(20254,'San Mateo RÃ­o Hondo',20),(20255,'San Mateo Sindihui',20),(20256,'San Mateo Tlapiltepec',20),(20257,'San Melchor Betaza',20),(20258,'San Miguel Achiutla',20),(20259,'San Miguel AhuehuetitlÃ¡n',20),(20260,'San Miguel AloÃ¡pam',20),(20261,'San Miguel AmatitlÃ¡n',20),(20262,'San Miguel AmatlÃ¡n',20),(20263,'San Miguel CoatlÃ¡n',20),(20264,'San Miguel Chicahua',20),(20265,'San Miguel Chimalapa',20),(20266,'San Miguel del Puerto',20),(20267,'San Miguel del RÃ­o',20),(20268,'San Miguel Ejutla',20),(20269,'San Miguel el Grande',20),(20270,'San Miguel Huautla',20),(20271,'San Miguel Mixtepec',20),(20272,'San Miguel Panixtlahuaca',20),(20273,'San Miguel Peras',20),(20274,'San Miguel Piedras',20),(20275,'San Miguel Quetzaltepec',20),(20276,'San Miguel Santa Flor',20),(20277,'Villa Sola de Vega',20),(20278,'San Miguel Soyaltepec',20),(20279,'San Miguel Suchixtepec',20),(20280,'Villa Talea de Castro',20),(20281,'San Miguel TecomatlÃ¡n',20),(20282,'San Miguel Tenango',20),(20283,'San Miguel Tequixtepec',20),(20284,'San Miguel TilquiÃ¡pam',20),(20285,'San Miguel Tlacamama',20),(20286,'San Miguel Tlacotepec',20),(20287,'San Miguel Tulancingo',20),(20288,'San Miguel Yotao',20),(20289,'San NicolÃ¡s',20),(20290,'San NicolÃ¡s Hidalgo',20),(20291,'San Pablo CoatlÃ¡n',20),(20292,'San Pablo Cuatro Venados',20),(20293,'San Pablo Etla',20),(20294,'San Pablo Huitzo',20),(20295,'San Pablo Huixtepec',20),(20296,'San Pablo Macuiltianguis',20),(20297,'San Pablo Tijaltepec',20),(20298,'San Pablo Villa de Mitla',20),(20299,'San Pablo Yaganiza',20),(20300,'San Pedro Amuzgos',20),(20301,'San Pedro ApÃ³stol',20),(20302,'San Pedro Atoyac',20),(20303,'San Pedro Cajonos',20),(20304,'San Pedro Coxcaltepec CÃ¡ntaros',20),(20305,'San Pedro Comitancillo',20),(20306,'San Pedro el Alto',20),(20307,'San Pedro Huamelula',20),(20308,'San Pedro Huilotepec',20),(20309,'San Pedro IxcatlÃ¡n',20),(20310,'San Pedro Ixtlahuaca',20),(20311,'San Pedro Jaltepetongo',20),(20312,'San Pedro JicayÃ¡n',20),(20313,'San Pedro Jocotipac',20),(20314,'San Pedro Juchatengo',20),(20315,'San Pedro MÃ¡rtir',20),(20316,'San Pedro MÃ¡rtir Quiechapa',20),(20317,'San Pedro MÃ¡rtir Yucuxaco',20),(20318,'San Pedro Mixtepec -Dto. 22 -',20),(20319,'San Pedro Mixtepec -Dto. 26 -',20),(20320,'San Pedro Molinos',20),(20321,'San Pedro Nopala',20),(20322,'San Pedro Ocopetatillo',20),(20323,'San Pedro Ocotepec',20),(20324,'San Pedro Pochutla',20),(20325,'San Pedro Quiatoni',20),(20326,'San Pedro SochiÃ¡pam',20),(20327,'San Pedro Tapanatepec',20),(20328,'San Pedro Taviche',20),(20329,'San Pedro Teozacoalco',20),(20330,'San Pedro Teutila',20),(20331,'San Pedro TidaÃ¡',20),(20332,'San Pedro Topiltepec',20),(20333,'San Pedro TotolÃ¡pam',20),(20334,'Villa de Tututepec',20),(20335,'San Pedro Yaneri',20),(20336,'San Pedro YÃ³lox',20),(20337,'San Pedro y San Pablo Ayutla',20),(20338,'Villa de Etla',20),(20339,'San Pedro y San Pablo Teposcolula',20),(20340,'San Pedro y San Pablo Tequixtepec',20),(20341,'San Pedro Yucunama',20),(20342,'San Raymundo Jalpan',20),(20343,'San SebastiÃ¡n Abasolo',20),(20344,'San SebastiÃ¡n CoatlÃ¡n',20),(20345,'San SebastiÃ¡n Ixcapa',20),(20346,'San SebastiÃ¡n Nicananduta',20),(20347,'San SebastiÃ¡n RÃ­o Hondo',20),(20348,'San SebastiÃ¡n Tecomaxtlahuaca',20),(20349,'San SebastiÃ¡n Teitipac',20),(20350,'San SebastiÃ¡n Tutla',20),(20351,'San SimÃ³n Almolongas',20),(20352,'San SimÃ³n ZahuatlÃ¡n',20),(20353,'Santa Ana',20),(20354,'Santa Ana Ateixtlahuaca',20),(20355,'Santa Ana CuauhtÃ©moc',20),(20356,'Santa Ana del Valle',20),(20357,'Santa Ana Tavela',20),(20358,'Santa Ana Tlapacoyan',20),(20359,'Santa Ana Yareni',20),(20360,'Santa Ana Zegache',20),(20361,'Santa Catalina QuierÃ­',20),(20362,'Santa Catarina Cuixtla',20),(20363,'Santa Catarina Ixtepeji',20),(20364,'Santa Catarina Juquila',20),(20365,'Santa Catarina Lachatao',20),(20366,'Santa Catarina Loxicha',20),(20367,'Santa Catarina MechoacÃ¡n',20),(20368,'Santa Catarina Minas',20),(20369,'Santa Catarina QuianÃ©',20),(20370,'Santa Catarina Tayata',20),(20371,'Santa Catarina TicuÃ¡',20),(20372,'Santa Catarina YosonotÃº',20),(20373,'Santa Catarina Zapoquila',20),(20374,'Santa Cruz Acatepec',20),(20375,'Santa Cruz Amilpas',20),(20376,'Santa Cruz de Bravo',20),(20377,'Santa Cruz Itundujia',20),(20378,'Santa Cruz Mixtepec',20),(20379,'Santa Cruz Nundaco',20),(20380,'Santa Cruz Papalutla',20),(20381,'Santa Cruz Tacache de Mina',20),(20382,'Santa Cruz Tacahua',20),(20383,'Santa Cruz Tayata',20),(20384,'Santa Cruz Xitla',20),(20385,'Santa Cruz XoxocotlÃ¡n',20),(20386,'Santa Cruz Zenzontepec',20),(20387,'Santa Gertrudis',20),(20388,'Santa InÃ©s del Monte',20),(20389,'Santa InÃ©s Yatzeche',20),(20390,'Santa LucÃ­a del Camino',20),(20391,'Santa LucÃ­a MiahuatlÃ¡n',20),(20392,'Santa LucÃ­a Monteverde',20),(20393,'Santa LucÃ­a OcotlÃ¡n',20),(20394,'Santa MarÃ­a Alotepec',20),(20395,'Santa MarÃ­a Apazco',20),(20396,'Santa MarÃ­a la AsunciÃ³n',20),(20397,'Heroica Ciudad de Tlaxiaco',20),(20398,'Ayoquezco de Aldama',20),(20399,'Santa MarÃ­a Atzompa',20),(20400,'Santa MarÃ­a CamotlÃ¡n',20),(20401,'Santa MarÃ­a Colotepec',20),(20402,'Santa MarÃ­a Cortijo',20),(20403,'Santa MarÃ­a Coyotepec',20),(20404,'Santa MarÃ­a ChachoÃ¡pam',20),(20405,'Villa de Chilapa de DÃ­az',20),(20406,'Santa MarÃ­a Chilchotla',20),(20407,'Santa MarÃ­a Chimalapa',20),(20408,'Santa MarÃ­a del Rosario',20),(20409,'Santa MarÃ­a del Tule',20),(20410,'Santa MarÃ­a Ecatepec',20),(20411,'Santa MarÃ­a GuelacÃ©',20),(20412,'Santa MarÃ­a Guienagati',20),(20413,'Santa MarÃ­a Huatulco',20),(20414,'Santa MarÃ­a HuazolotitlÃ¡n',20),(20415,'Santa MarÃ­a Ipalapa',20),(20416,'Santa MarÃ­a IxcatlÃ¡n',20),(20417,'Santa MarÃ­a Jacatepec',20),(20418,'Santa MarÃ­a Jalapa del MarquÃ©s',20),(20419,'Santa MarÃ­a Jaltianguis',20),(20420,'Santa MarÃ­a LachixÃ­o',20),(20421,'Santa MarÃ­a Mixtequilla',20),(20422,'Santa MarÃ­a Nativitas',20),(20423,'Santa MarÃ­a Nduayaco',20),(20424,'Santa MarÃ­a Ozolotepec',20),(20425,'Santa MarÃ­a PÃ¡palo',20),(20426,'Santa MarÃ­a PeÃ±oles',20),(20427,'Santa MarÃ­a Petapa',20),(20428,'Santa MarÃ­a Quiegolani',20),(20429,'Santa MarÃ­a Sola',20),(20430,'Santa MarÃ­a Tataltepec',20),(20431,'Santa MarÃ­a Tecomavaca',20),(20432,'Santa MarÃ­a Temaxcalapa',20),(20433,'Santa MarÃ­a Temaxcaltepec',20),(20434,'Santa MarÃ­a Teopoxco',20),(20435,'Santa MarÃ­a Tepantlali',20),(20436,'Santa MarÃ­a TexcatitlÃ¡n',20),(20437,'Santa MarÃ­a Tlahuitoltepec',20),(20438,'Santa MarÃ­a Tlalixtac',20),(20439,'Santa MarÃ­a Tonameca',20),(20440,'Santa MarÃ­a Totolapilla',20),(20441,'Santa MarÃ­a Xadani',20),(20442,'Santa MarÃ­a Yalina',20),(20443,'Santa MarÃ­a YavesÃ­a',20),(20444,'Santa MarÃ­a Yolotepec',20),(20445,'Santa MarÃ­a YosoyÃºa',20),(20446,'Santa MarÃ­a Yucuhiti',20),(20447,'Santa MarÃ­a Zacatepec',20),(20448,'Santa MarÃ­a Zaniza',20),(20449,'Santa MarÃ­a ZoquitlÃ¡n',20),(20450,'Santiago Amoltepec',20),(20451,'Santiago Apoala',20),(20452,'Santiago ApÃ³stol',20),(20453,'Santiago Astata',20),(20454,'Santiago AtitlÃ¡n',20),(20455,'Santiago Ayuquililla',20),(20456,'Santiago Cacaloxtepec',20),(20457,'Santiago CamotlÃ¡n',20),(20458,'Santiago Comaltepec',20),(20459,'Santiago Chazumba',20),(20460,'Santiago ChoÃ¡pam',20),(20461,'Santiago del RÃ­o',20),(20462,'Santiago HuajolotitlÃ¡n',20),(20463,'Santiago Huauclilla',20),(20464,'Santiago IhuitlÃ¡n Plumas',20),(20465,'Santiago Ixcuintepec',20),(20466,'Santiago Ixtayutla',20),(20467,'Santiago Jamiltepec',20),(20468,'Santiago Jocotepec',20),(20469,'Santiago Juxtlahuaca',20),(20470,'Santiago Lachiguiri',20),(20471,'Santiago Lalopa',20),(20472,'Santiago Laollaga',20),(20473,'Santiago Laxopa',20),(20474,'Santiago Llano Grande',20),(20475,'Santiago MatatlÃ¡n',20),(20476,'Santiago Miltepec',20),(20477,'Santiago Minas',20),(20478,'Santiago Nacaltepec',20),(20479,'Santiago Nejapilla',20),(20480,'Santiago Nundiche',20),(20481,'Santiago NuyoÃ³',20),(20482,'Santiago Pinotepa Nacional',20),(20483,'Santiago Suchilquitongo',20),(20484,'Santiago Tamazola',20),(20485,'Santiago Tapextla',20),(20486,'Villa TejÃºpam de la UniÃ³n',20),(20487,'Santiago Tenango',20),(20488,'Santiago Tepetlapa',20),(20489,'Santiago Tetepec',20),(20490,'Santiago Texcalcingo',20),(20491,'Santiago TextitlÃ¡n',20),(20492,'Santiago Tilantongo',20),(20493,'Santiago Tillo',20),(20494,'Santiago Tlazoyaltepec',20),(20495,'Santiago Xanica',20),(20496,'Santiago XiacuÃ­',20),(20497,'Santiago Yaitepec',20),(20498,'Santiago Yaveo',20),(20499,'Santiago YolomÃ©catl',20),(20500,'Santiago YosondÃºa',20),(20501,'Santiago Yucuyachi',20),(20502,'Santiago Zacatepec',20),(20503,'Santiago Zoochila',20),(20504,'Nuevo ZoquiÃ¡pam',20),(20505,'Santo Domingo Ingenio',20),(20506,'Santo Domingo Albarradas',20),(20507,'Santo Domingo Armenta',20),(20508,'Santo Domingo ChihuitÃ¡n',20),(20509,'Santo Domingo de Morelos',20),(20510,'Santo Domingo IxcatlÃ¡n',20),(20511,'Santo Domingo NuxaÃ¡',20),(20512,'Santo Domingo Ozolotepec',20),(20513,'Santo Domingo Petapa',20),(20514,'Santo Domingo Roayaga',20),(20515,'Santo Domingo Tehuantepec',20),(20516,'Santo Domingo Teojomulco',20),(20517,'Santo Domingo Tepuxtepec',20),(20518,'Santo Domingo TlatayÃ¡pam',20),(20519,'Santo Domingo Tomaltepec',20),(20520,'Santo Domingo TonalÃ¡',20),(20521,'Santo Domingo Tonaltepec',20),(20522,'Santo Domingo XagacÃ­a',20),(20523,'Santo Domingo YanhuitlÃ¡n',20),(20524,'Santo Domingo Yodohino',20),(20525,'Santo Domingo Zanatepec',20),(20526,'Santos Reyes Nopala',20),(20527,'Santos Reyes PÃ¡palo',20),(20528,'Santos Reyes Tepejillo',20),(20529,'Santos Reyes YucunÃ¡',20),(20530,'Santo TomÃ¡s Jalieza',20),(20531,'Santo TomÃ¡s Mazaltepec',20),(20532,'Santo TomÃ¡s Ocotepec',20),(20533,'Santo TomÃ¡s Tamazulapan',20),(20534,'San Vicente CoatlÃ¡n',20),(20535,'San Vicente LachixÃ­o',20),(20536,'San Vicente NuÃ±Ãº',20),(20537,'SilacayoÃ¡pam',20),(20538,'Sitio de Xitlapehua',20),(20539,'Soledad Etla',20),(20540,'Villa de TamazulÃ¡pam del Progreso',20),(20541,'Tanetze de Zaragoza',20),(20542,'Taniche',20),(20543,'Tataltepec de ValdÃ©s',20),(20544,'Teococuilco de Marcos PÃ©rez',20),(20545,'TeotitlÃ¡n de Flores MagÃ³n',20),(20546,'TeotitlÃ¡n del Valle',20),(20547,'Teotongo',20),(20548,'Tepelmeme Villa de Morelos',20),(20549,'TezoatlÃ¡n de Segura y Luna',20),(20550,'San JerÃ³nimo Tlacochahuaya',20),(20551,'Tlacolula de Matamoros',20),(20552,'Tlacotepec Plumas',20),(20553,'Tlalixtac de Cabrera',20),(20554,'Totontepec Villa de Morelos',20),(20555,'Trinidad Zaachila',20),(20556,'La Trinidad Vista Hermosa',20),(20557,'UniÃ³n Hidalgo',20),(20558,'Valerio Trujano',20),(20559,'San Juan Bautista Valle Nacional',20),(20560,'Villa DÃ­az Ordaz',20),(20561,'Yaxe',20),(20562,'Magdalena Yodocono de Porfirio DÃ­az',20),(20563,'Yogana',20),(20564,'Yutanduchi de Guerrero',20),(20565,'Villa de Zaachila',20),(20566,'San Mateo Yucutindoo',20),(20567,'ZapotitlÃ¡n Lagunas',20),(20568,'ZapotitlÃ¡n Palmas',20),(20569,'Santa InÃ©s de Zaragoza',20),(20570,'ZimatlÃ¡n de Ãlvarez',20),(21001,'Acajete',21),(21002,'Acateno',21),(21003,'AcatlÃ¡n',21),(21004,'Acatzingo',21),(21005,'Acteopan',21),(21006,'AhuacatlÃ¡n',21),(21007,'AhuatlÃ¡n',21),(21008,'Ahuazotepec',21),(21009,'Ahuehuetitla',21),(21010,'Ajalpan',21),(21011,'Albino Zertuche',21),(21012,'Aljojuca',21),(21013,'Altepexi',21),(21014,'AmixtlÃ¡n',21),(21015,'Amozoc',21),(21016,'Aquixtla',21),(21017,'Atempan',21),(21018,'Atexcal',21),(21019,'Atlixco',21),(21020,'Atoyatempan',21),(21021,'Atzala',21),(21022,'AtzitzihuacÃ¡n',21),(21023,'Atzitzintla',21),(21024,'Axutla',21),(21025,'Ayotoxco de Guerrero',21),(21026,'Calpan',21),(21027,'Caltepec',21),(21028,'Camocuautla',21),(21029,'Caxhuacan',21),(21030,'Coatepec',21),(21031,'Coatzingo',21),(21032,'Cohetzala',21),(21033,'Cohuecan',21),(21034,'Coronango',21),(21035,'CoxcatlÃ¡n',21),(21036,'Coyomeapan',21),(21037,'Coyotepec',21),(21038,'Cuapiaxtla de Madero',21),(21039,'Cuautempan',21),(21040,'CuautinchÃ¡n',21),(21041,'Cuautlancingo',21),(21042,'Cuayuca de Andrade',21),(21043,'Cuetzalan del Progreso',21),(21044,'Cuyoaco',21),(21045,'Chalchicomula de Sesma',21),(21046,'Chapulco',21),(21047,'Chiautla',21),(21048,'Chiautzingo',21),(21049,'Chiconcuautla',21),(21050,'Chichiquila',21),(21051,'Chietla',21),(21052,'ChigmecatitlÃ¡n',21),(21053,'Chignahuapan',21),(21054,'Chignautla',21),(21055,'Chila',21),(21056,'Chila de la Sal',21),(21057,'Honey',21),(21058,'Chilchotla',21),(21059,'Chinantla',21),(21060,'Domingo Arenas',21),(21061,'EloxochitlÃ¡n',21),(21062,'EpatlÃ¡n',21),(21063,'Esperanza',21),(21064,'Francisco Z. Mena',21),(21065,'General Felipe Ãngeles',21),(21066,'Guadalupe',21),(21067,'Guadalupe Victoria',21),(21068,'Hermenegildo Galeana',21),(21069,'Huaquechula',21),(21070,'Huatlatlauca',21),(21071,'Huauchinango',21),(21072,'Huehuetla',21),(21073,'HuehuetlÃ¡n el Chico',21),(21074,'Huejotzingo',21),(21075,'Hueyapan',21),(21076,'Hueytamalco',21),(21077,'Hueytlalpan',21),(21078,'Huitzilan de SerdÃ¡n',21),(21079,'Huitziltepec',21),(21080,'Atlequizayan',21),(21081,'Ixcamilpa de Guerrero',21),(21082,'Ixcaquixtla',21),(21083,'IxtacamaxtitlÃ¡n',21),(21084,'Ixtepec',21),(21085,'IzÃºcar de Matamoros',21),(21086,'Jalpan',21),(21087,'Jolalpan',21),(21088,'Jonotla',21),(21089,'Jopala',21),(21090,'Juan C. Bonilla',21),(21091,'Juan Galindo',21),(21092,'Juan N. MÃ©ndez',21),(21093,'Lafragua',21),(21094,'Libres',21),(21095,'La Magdalena Tlatlauquitepec',21),(21096,'Mazapiltepec de JuÃ¡rez',21),(21097,'Mixtla',21),(21098,'Molcaxac',21),(21099,'CaÃ±ada Morelos',21),(21100,'Naupan',21),(21101,'Nauzontla',21),(21102,'Nealtican',21),(21103,'NicolÃ¡s Bravo',21),(21104,'Nopalucan',21),(21105,'Ocotepec',21),(21106,'Ocoyucan',21),(21107,'Olintla',21),(21108,'Oriental',21),(21109,'PahuatlÃ¡n',21),(21110,'Palmar de Bravo',21),(21111,'Pantepec',21),(21112,'Petlalcingo',21),(21113,'Piaxtla',21),(21114,'Puebla',21),(21115,'Quecholac',21),(21116,'QuimixtlÃ¡n',21),(21117,'Rafael Lara Grajales',21),(21118,'Los Reyes de JuÃ¡rez',21),(21119,'San AndrÃ©s Cholula',21),(21120,'San Antonio CaÃ±ada',21),(21121,'San Diego la Mesa Tochimiltzingo',21),(21122,'San Felipe Teotlalcingo',21),(21123,'San Felipe TepatlÃ¡n',21),(21124,'San Gabriel Chilac',21),(21125,'San Gregorio Atzompa',21),(21126,'San JerÃ³nimo Tecuanipan',21),(21127,'San JerÃ³nimo XayacatlÃ¡n',21),(21128,'San JosÃ© Chiapa',21),(21129,'San JosÃ© MiahuatlÃ¡n',21),(21130,'San Juan Atenco',21),(21131,'San Juan Atzompa',21),(21132,'San MartÃ­n Texmelucan',21),(21133,'San MartÃ­n Totoltepec',21),(21134,'San MatÃ­as Tlalancaleca',21),(21135,'San Miguel IxitlÃ¡n',21),(21136,'San Miguel Xoxtla',21),(21137,'San NicolÃ¡s Buenos Aires',21),(21138,'San NicolÃ¡s de los Ranchos',21),(21139,'San Pablo Anicano',21),(21140,'San Pedro Cholula',21),(21141,'San Pedro Yeloixtlahuaca',21),(21142,'San Salvador el Seco',21),(21143,'San Salvador el Verde',21),(21144,'San Salvador Huixcolotla',21),(21145,'San SebastiÃ¡n Tlacotepec',21),(21146,'Santa Catarina Tlaltempan',21),(21147,'Santa InÃ©s Ahuatempan',21),(21148,'Santa Isabel Cholula',21),(21149,'Santiago MiahuatlÃ¡n',21),(21150,'HuehuetlÃ¡n el Grande',21),(21151,'Santo TomÃ¡s Hueyotlipan',21),(21152,'Soltepec',21),(21153,'Tecali de Herrera',21),(21154,'Tecamachalco',21),(21155,'TecomatlÃ¡n',21),(21156,'TehuacÃ¡n',21),(21157,'Tehuitzingo',21),(21158,'Tenampulco',21),(21159,'TeopantlÃ¡n',21),(21160,'Teotlalco',21),(21161,'Tepanco de LÃ³pez',21),(21162,'Tepango de RodrÃ­guez',21),(21163,'Tepatlaxco de Hidalgo',21),(21164,'Tepeaca',21),(21165,'Tepemaxalco',21),(21166,'Tepeojuma',21),(21167,'Tepetzintla',21),(21168,'Tepexco',21),(21169,'Tepexi de RodrÃ­guez',21),(21170,'Tepeyahualco',21),(21171,'Tepeyahualco de CuauhtÃ©moc',21),(21172,'Tetela de Ocampo',21),(21173,'Teteles de Avila Castillo',21),(21174,'TeziutlÃ¡n',21),(21175,'Tianguismanalco',21),(21176,'Tilapa',21),(21177,'Tlacotepec de Benito JuÃ¡rez',21),(21178,'Tlacuilotepec',21),(21179,'Tlachichuca',21),(21180,'Tlahuapan',21),(21181,'Tlaltenango',21),(21182,'Tlanepantla',21),(21183,'Tlaola',21),(21184,'Tlapacoya',21),(21185,'TlapanalÃ¡',21),(21186,'Tlatlauquitepec',21),(21187,'Tlaxco',21),(21188,'Tochimilco',21),(21189,'Tochtepec',21),(21190,'Totoltepec de Guerrero',21),(21191,'Tulcingo',21),(21192,'Tuzamapan de Galeana',21),(21193,'Tzicatlacoyan',21),(21194,'Venustiano Carranza',21),(21195,'Vicente Guerrero',21),(21196,'XayacatlÃ¡n de Bravo',21),(21197,'Xicotepec',21),(21198,'XicotlÃ¡n',21),(21199,'Xiutetelco',21),(21200,'Xochiapulco',21),(21201,'Xochiltepec',21),(21202,'XochitlÃ¡n de Vicente SuÃ¡rez',21),(21203,'XochitlÃ¡n Todos Santos',21),(21204,'YaonÃ¡huac',21),(21205,'Yehualtepec',21),(21206,'Zacapala',21),(21207,'Zacapoaxtla',21),(21208,'ZacatlÃ¡n',21),(21209,'ZapotitlÃ¡n',21),(21210,'ZapotitlÃ¡n de MÃ©ndez',21),(21211,'Zaragoza',21),(21212,'Zautla',21),(21213,'Zihuateutla',21),(21214,'Zinacatepec',21),(21215,'Zongozotla',21),(21216,'Zoquiapan',21),(21217,'ZoquitlÃ¡n',21),(22001,'Amealco de Bonfil',22),(22002,'Pinal de Amoles',22),(22003,'Arroyo Seco',22),(22004,'Cadereyta de Montes',22),(22005,'ColÃ³n',22),(22006,'Corregidora',22),(22007,'Ezequiel Montes',22),(22008,'Huimilpan',22),(22009,'Jalpan de Serra',22),(22010,'Landa de Matamoros',22),(22011,'El MarquÃ©s',22),(22012,'Pedro Escobedo',22),(22013,'PeÃ±amiller',22),(22014,'QuerÃ©taro',22),(22015,'San JoaquÃ­n',22),(22016,'San Juan del RÃ­o',22),(22017,'Tequisquiapan',22),(22018,'TolimÃ¡n',22),(23001,'Cozumel',23),(23002,'Felipe Carrillo Puerto',23),(23003,'Isla Mujeres',23),(23004,'OthÃ³n P. Blanco',23),(23005,'Benito JuÃ¡rez',23),(23006,'JosÃ© MarÃ­a Morelos',23),(23007,'LÃ¡zaro CÃ¡rdenas',23),(23008,'Solidaridad',23),(23009,'Tulum',23),(23010,'Bacalar',23),(23011,'Puerto Morelos',23),(24001,'Ahualulco',24),(24002,'Alaquines',24),(24003,'AquismÃ³n',24),(24004,'Armadillo de los Infante',24),(24005,'CÃ¡rdenas',24),(24006,'Catorce',24),(24007,'Cedral',24),(24008,'Cerritos',24),(24009,'Cerro de San Pedro',24),(24010,'Ciudad del MaÃ­z',24),(24011,'Ciudad FernÃ¡ndez',24),(24012,'Tancanhuitz',24),(24013,'Ciudad Valles',24),(24014,'CoxcatlÃ¡n',24),(24015,'Charcas',24),(24016,'Ebano',24),(24017,'GuadalcÃ¡zar',24),(24018,'HuehuetlÃ¡n',24),(24019,'Lagunillas',24),(24020,'Matehuala',24),(24021,'Mexquitic de Carmona',24),(24022,'Moctezuma',24),(24023,'RayÃ³n',24),(24024,'Rioverde',24),(24025,'Salinas',24),(24026,'San Antonio',24),(24027,'San Ciro de Acosta',24),(24028,'San Luis PotosÃ­',24),(24029,'San MartÃ­n Chalchicuautla',24),(24030,'San NicolÃ¡s Tolentino',24),(24031,'Santa Catarina',24),(24032,'Santa MarÃ­a del RÃ­o',24),(24033,'Santo Domingo',24),(24034,'San Vicente Tancuayalab',24),(24035,'Soledad de Graciano SÃ¡nchez',24),(24036,'Tamasopo',24),(24037,'Tamazunchale',24),(24038,'TampacÃ¡n',24),(24039,'TampamolÃ³n Corona',24),(24040,'TamuÃ­n',24),(24041,'TanlajÃ¡s',24),(24042,'TanquiÃ¡n de Escobedo',24),(24043,'Tierra Nueva',24),(24044,'Vanegas',24),(24045,'Venado',24),(24046,'Villa de Arriaga',24),(24047,'Villa de Guadalupe',24),(24048,'Villa de la Paz',24),(24049,'Villa de Ramos',24),(24050,'Villa de Reyes',24),(24051,'Villa Hidalgo',24),(24052,'Villa JuÃ¡rez',24),(24053,'Axtla de Terrazas',24),(24054,'Xilitla',24),(24055,'Zaragoza',24),(24056,'Villa de Arista',24),(24057,'Matlapa',24),(24058,'El Naranjo',24),(25001,'Ahome',25),(25002,'Angostura',25),(25003,'Badiraguato',25),(25004,'Concordia',25),(25005,'CosalÃ¡',25),(25006,'CuliacÃ¡n',25),(25007,'Choix',25),(25008,'Elota',25),(25009,'Escuinapa',25),(25010,'El Fuerte',25),(25011,'Guasave',25),(25012,'MazatlÃ¡n',25),(25013,'Mocorito',25),(25014,'Rosario',25),(25015,'Salvador Alvarado',25),(25016,'San Ignacio',25),(25017,'Sinaloa',25),(25018,'Navolato',25),(26001,'Aconchi',26),(26002,'Agua Prieta',26),(26003,'Alamos',26),(26004,'Altar',26),(26005,'Arivechi',26),(26006,'Arizpe',26),(26007,'Atil',26),(26008,'BacadÃ©huachi',26),(26009,'Bacanora',26),(26010,'Bacerac',26),(26011,'Bacoachi',26),(26012,'BÃ¡cum',26),(26013,'BanÃ¡michi',26),(26014,'BaviÃ¡cora',26),(26015,'Bavispe',26),(26016,'BenjamÃ­n Hill',26),(26017,'Caborca',26),(26018,'Cajeme',26),(26019,'Cananea',26),(26020,'CarbÃ³',26),(26021,'La Colorada',26),(26022,'Cucurpe',26),(26023,'Cumpas',26),(26024,'Divisaderos',26),(26025,'Empalme',26),(26026,'Etchojoa',26),(26027,'Fronteras',26),(26028,'Granados',26),(26029,'Guaymas',26),(26030,'Hermosillo',26),(26031,'Huachinera',26),(26032,'HuÃ¡sabas',26),(26033,'Huatabampo',26),(26034,'HuÃ©pac',26),(26035,'Imuris',26),(26036,'Magdalena',26),(26037,'MazatÃ¡n',26),(26038,'Moctezuma',26),(26039,'Naco',26),(26040,'NÃ¡cori Chico',26),(26041,'Nacozari de GarcÃ­a',26),(26042,'Navojoa',26),(26043,'Nogales',26),(26044,'Onavas',26),(26045,'Opodepe',26),(26046,'Oquitoa',26),(26047,'Pitiquito',26),(26048,'Puerto PeÃ±asco',26),(26049,'Quiriego',26),(26050,'RayÃ³n',26),(26051,'Rosario',26),(26052,'Sahuaripa',26),(26053,'San Felipe de JesÃºs',26),(26054,'San Javier',26),(26055,'San Luis RÃ­o Colorado',26),(26056,'San Miguel de Horcasitas',26),(26057,'San Pedro de la Cueva',26),(26058,'Santa Ana',26),(26059,'Santa Cruz',26),(26060,'SÃ¡ric',26),(26061,'Soyopa',26),(26062,'Suaqui Grande',26),(26063,'Tepache',26),(26064,'Trincheras',26),(26065,'Tubutama',26),(26066,'Ures',26),(26067,'Villa Hidalgo',26),(26068,'Villa Pesqueira',26),(26069,'YÃ©cora',26),(26070,'General Plutarco ElÃ­as Calles',26),(26071,'Benito JuÃ¡rez',26),(26072,'San Ignacio RÃ­o Muerto',26),(27001,'BalancÃ¡n',27),(27002,'CÃ¡rdenas',27),(27003,'Centla',27),(27004,'Centro',27),(27005,'Comalcalco',27),(27006,'CunduacÃ¡n',27),(27007,'Emiliano Zapata',27),(27008,'Huimanguillo',27),(27009,'Jalapa',27),(27010,'Jalpa de MÃ©ndez',27),(27011,'Jonuta',27),(27012,'Macuspana',27),(27013,'Nacajuca',27),(27014,'ParaÃ­so',27),(27015,'Tacotalpa',27),(27016,'Teapa',27),(27017,'Tenosique',27),(28001,'Abasolo',28),(28002,'Aldama',28),(28003,'Altamira',28),(28004,'Antiguo Morelos',28),(28005,'Burgos',28),(28006,'Bustamante',28),(28007,'Camargo',28),(28008,'Casas',28),(28009,'Ciudad Madero',28),(28010,'Cruillas',28),(28011,'GÃ³mez FarÃ­as',28),(28012,'GonzÃ¡lez',28),(28013,'GÃ¼Ã©mez',28),(28014,'Guerrero',28),(28015,'Gustavo DÃ­az Ordaz',28),(28016,'Hidalgo',28),(28017,'Jaumave',28),(28018,'JimÃ©nez',28),(28019,'Llera',28),(28020,'Mainero',28),(28021,'El Mante',28),(28022,'Matamoros',28),(28023,'MÃ©ndez',28),(28024,'Mier',28),(28025,'Miguel AlemÃ¡n',28),(28026,'Miquihuana',28),(28027,'Nuevo Laredo',28),(28028,'Nuevo Morelos',28),(28029,'Ocampo',28),(28030,'Padilla',28),(28031,'Palmillas',28),(28032,'Reynosa',28),(28033,'RÃ­o Bravo',28),(28034,'San Carlos',28),(28035,'San Fernando',28),(28036,'San NicolÃ¡s',28),(28037,'Soto la Marina',28),(28038,'Tampico',28),(28039,'Tula',28),(28040,'Valle Hermoso',28),(28041,'Victoria',28),(28042,'VillagrÃ¡n',28),(28043,'XicotÃ©ncatl',28),(29001,'Amaxac de Guerrero',29),(29002,'ApetatitlÃ¡n de Antonio Carvajal',29),(29003,'Atlangatepec',29),(29004,'Atltzayanca',29),(29005,'Apizaco',29),(29006,'Calpulalpan',29),(29007,'El Carmen Tequexquitla',29),(29008,'Cuapiaxtla',29),(29009,'Cuaxomulco',29),(29010,'Chiautempan',29),(29011,'MuÃ±oz de Domingo Arenas',29),(29012,'EspaÃ±ita',29),(29013,'Huamantla',29),(29014,'Hueyotlipan',29),(29015,'Ixtacuixtla de Mariano Matamoros',29),(29016,'Ixtenco',29),(29017,'Mazatecochco de JosÃ© MarÃ­a Morelos',29),(29018,'Contla de Juan Cuamatzi',29),(29019,'Tepetitla de LardizÃ¡bal',29),(29020,'SanctÃ³rum de LÃ¡zaro CÃ¡rdenas',29),(29021,'Nanacamilpa de Mariano Arista',29),(29022,'Acuamanala de Miguel Hidalgo',29),(29023,'NatÃ­vitas',29),(29024,'Panotla',29),(29025,'San Pablo del Monte',29),(29026,'Santa Cruz Tlaxcala',29),(29027,'Tenancingo',29),(29028,'Teolocholco',29),(29029,'Tepeyanco',29),(29030,'Terrenate',29),(29031,'Tetla de la Solidaridad',29),(29032,'Tetlatlahuca',29),(29033,'Tlaxcala',29),(29034,'Tlaxco',29),(29035,'TocatlÃ¡n',29),(29036,'Totolac',29),(29037,'ZiltlaltÃ©pec de Trinidad SÃ¡nchez Santos',29),(29038,'Tzompantepec',29),(29039,'Xaloztoc',29),(29040,'Xaltocan',29),(29041,'Papalotla de XicohtÃ©ncatl',29),(29042,'Xicohtzinco',29),(29043,'Yauhquemehcan',29),(29044,'Zacatelco',29),(29045,'Benito JuÃ¡rez',29),(29046,'Emiliano Zapata',29),(29047,'LÃ¡zaro CÃ¡rdenas',29),(29048,'La Magdalena Tlaltelulco',29),(29049,'San DamiÃ¡n TexÃ³loc',29),(29050,'San Francisco Tetlanohcan',29),(29051,'San JerÃ³nimo Zacualpan',29),(29052,'San JosÃ© Teacalco',29),(29053,'San Juan Huactzinco',29),(29054,'San Lorenzo Axocomanitla',29),(29055,'San Lucas Tecopilco',29),(29056,'Santa Ana Nopalucan',29),(29057,'Santa Apolonia Teacalco',29),(29058,'Santa Catarina Ayometla',29),(29059,'Santa Cruz Quilehtla',29),(29060,'Santa Isabel Xiloxoxtla',29),(30001,'Acajete',30),(30002,'AcatlÃ¡n',30),(30003,'Acayucan',30),(30004,'Actopan',30),(30005,'Acula',30),(30006,'Acultzingo',30),(30007,'CamarÃ³n de Tejeda',30),(30008,'AlpatlÃ¡huac',30),(30009,'Alto Lucero de GutiÃ©rrez Barrios',30),(30010,'Altotonga',30),(30011,'Alvarado',30),(30012,'AmatitlÃ¡n',30),(30013,'Naranjos AmatlÃ¡n',30),(30014,'AmatlÃ¡n de los Reyes',30),(30015,'Angel R. Cabada',30),(30016,'La Antigua',30),(30017,'Apazapan',30),(30018,'Aquila',30),(30019,'Astacinga',30),(30020,'Atlahuilco',30),(30021,'Atoyac',30),(30022,'Atzacan',30),(30023,'Atzalan',30),(30024,'Tlaltetela',30),(30025,'Ayahualulco',30),(30026,'Banderilla',30),(30027,'Benito JuÃ¡rez',30),(30028,'Boca del RÃ­o',30),(30029,'Calcahualco',30),(30030,'Camerino Z. Mendoza',30),(30031,'Carrillo Puerto',30),(30032,'Catemaco',30),(30033,'Cazones de Herrera',30),(30034,'Cerro Azul',30),(30035,'CitlaltÃ©petl',30),(30036,'Coacoatzintla',30),(30037,'CoahuitlÃ¡n',30),(30038,'Coatepec',30),(30039,'Coatzacoalcos',30),(30040,'Coatzintla',30),(30041,'Coetzala',30),(30042,'Colipa',30),(30043,'Comapa',30),(30044,'CÃ³rdoba',30),(30045,'Cosamaloapan de Carpio',30),(30046,'CosautlÃ¡n de Carvajal',30),(30047,'Coscomatepec',30),(30048,'Cosoleacaque',30),(30049,'Cotaxtla',30),(30050,'Coxquihui',30),(30051,'Coyutla',30),(30052,'Cuichapa',30),(30053,'CuitlÃ¡huac',30),(30054,'Chacaltianguis',30),(30055,'Chalma',30),(30056,'Chiconamel',30),(30057,'Chiconquiaco',30),(30058,'Chicontepec',30),(30059,'Chinameca',30),(30060,'Chinampa de Gorostiza',30),(30061,'Las Choapas',30),(30062,'ChocamÃ¡n',30),(30063,'Chontla',30),(30064,'ChumatlÃ¡n',30),(30065,'Emiliano Zapata',30),(30066,'Espinal',30),(30067,'Filomeno Mata',30),(30068,'FortÃ­n',30),(30069,'GutiÃ©rrez Zamora',30),(30070,'HidalgotitlÃ¡n',30),(30071,'Huatusco',30),(30072,'Huayacocotla',30),(30073,'Hueyapan de Ocampo',30),(30074,'Huiloapan de CuauhtÃ©moc',30),(30075,'Ignacio de la Llave',30),(30076,'IlamatlÃ¡n',30),(30077,'Isla',30),(30078,'Ixcatepec',30),(30079,'IxhuacÃ¡n de los Reyes',30),(30080,'IxhuatlÃ¡n del CafÃ©',30),(30081,'Ixhuatlancillo',30),(30082,'IxhuatlÃ¡n del Sureste',30),(30083,'IxhuatlÃ¡n de Madero',30),(30084,'Ixmatlahuacan',30),(30085,'IxtaczoquitlÃ¡n',30),(30086,'Jalacingo',30),(30087,'Xalapa',30),(30088,'Jalcomulco',30),(30089,'JÃ¡ltipan',30),(30090,'Jamapa',30),(30091,'JesÃºs Carranza',30),(30092,'Xico',30),(30093,'Jilotepec',30),(30094,'Juan RodrÃ­guez Clara',30),(30095,'Juchique de Ferrer',30),(30096,'Landero y Coss',30),(30097,'Lerdo de Tejada',30),(30098,'Magdalena',30),(30099,'Maltrata',30),(30100,'Manlio Fabio Altamirano',30),(30101,'Mariano Escobedo',30),(30102,'MartÃ­nez de la Torre',30),(30103,'MecatlÃ¡n',30),(30104,'Mecayapan',30),(30105,'MedellÃ­n de Bravo',30),(30106,'MiahuatlÃ¡n',30),(30107,'Las Minas',30),(30108,'MinatitlÃ¡n',30),(30109,'Misantla',30),(30110,'Mixtla de Altamirano',30),(30111,'MoloacÃ¡n',30),(30112,'Naolinco',30),(30113,'Naranjal',30),(30114,'Nautla',30),(30115,'Nogales',30),(30116,'Oluta',30),(30117,'Omealca',30),(30118,'Orizaba',30),(30119,'OtatitlÃ¡n',30),(30120,'Oteapan',30),(30121,'Ozuluama de MascareÃ±as',30),(30122,'Pajapan',30),(30123,'PÃ¡nuco',30),(30124,'Papantla',30),(30125,'Paso del Macho',30),(30126,'Paso de Ovejas',30),(30127,'La Perla',30),(30128,'Perote',30),(30129,'PlatÃ³n SÃ¡nchez',30),(30130,'Playa Vicente',30),(30131,'Poza Rica de Hidalgo',30),(30132,'Las Vigas de RamÃ­rez',30),(30133,'Pueblo Viejo',30),(30134,'Puente Nacional',30),(30135,'Rafael Delgado',30),(30136,'Rafael Lucio',30),(30137,'Los Reyes',30),(30138,'RÃ­o Blanco',30),(30139,'Saltabarranca',30),(30140,'San AndrÃ©s Tenejapan',30),(30141,'San AndrÃ©s Tuxtla',30),(30142,'San Juan Evangelista',30),(30143,'Santiago Tuxtla',30),(30144,'Sayula de AlemÃ¡n',30),(30145,'Soconusco',30),(30146,'Sochiapa',30),(30147,'Soledad Atzompa',30),(30148,'Soledad de Doblado',30),(30149,'Soteapan',30),(30150,'TamalÃ­n',30),(30151,'Tamiahua',30),(30152,'Tampico Alto',30),(30153,'Tancoco',30),(30154,'Tantima',30),(30155,'Tantoyuca',30),(30156,'Tatatila',30),(30157,'Castillo de Teayo',30),(30158,'Tecolutla',30),(30159,'Tehuipango',30),(30160,'Ãlamo Temapache',30),(30161,'Tempoal',30),(30162,'Tenampa',30),(30163,'TenochtitlÃ¡n',30),(30164,'Teocelo',30),(30165,'Tepatlaxco',30),(30166,'TepetlÃ¡n',30),(30167,'Tepetzintla',30),(30168,'Tequila',30),(30169,'JosÃ© Azueta',30),(30170,'Texcatepec',30),(30171,'TexhuacÃ¡n',30),(30172,'Texistepec',30),(30173,'Tezonapa',30),(30174,'Tierra Blanca',30),(30175,'TihuatlÃ¡n',30),(30176,'Tlacojalpan',30),(30177,'Tlacolulan',30),(30178,'Tlacotalpan',30),(30179,'Tlacotepec de MejÃ­a',30),(30180,'Tlachichilco',30),(30181,'Tlalixcoyan',30),(30182,'Tlalnelhuayocan',30),(30183,'Tlapacoyan',30),(30184,'Tlaquilpa',30),(30185,'Tlilapan',30),(30186,'TomatlÃ¡n',30),(30187,'TonayÃ¡n',30),(30188,'Totutla',30),(30189,'Tuxpan',30),(30190,'Tuxtilla',30),(30191,'Ursulo GalvÃ¡n',30),(30192,'Vega de Alatorre',30),(30193,'Veracruz',30),(30194,'Villa Aldama',30),(30195,'Xoxocotla',30),(30196,'Yanga',30),(30197,'Yecuatla',30),(30198,'Zacualpan',30),(30199,'Zaragoza',30),(30200,'Zentla',30),(30201,'Zongolica',30),(30202,'ZontecomatlÃ¡n de LÃ³pez y Fuentes',30),(30203,'Zozocolco de Hidalgo',30),(30204,'Agua Dulce',30),(30205,'El Higo',30),(30206,'Nanchital de LÃ¡zaro CÃ¡rdenas del RÃ­o',30),(30207,'Tres Valles',30),(30208,'Carlos A. Carrillo',30),(30209,'Tatahuicapan de JuÃ¡rez',30),(30210,'Uxpanapa',30),(30211,'San Rafael',30),(30212,'Santiago Sochiapan',30),(31001,'AbalÃ¡',31),(31002,'Acanceh',31),(31003,'Akil',31),(31004,'Baca',31),(31005,'BokobÃ¡',31),(31006,'Buctzotz',31),(31007,'CacalchÃ©n',31),(31008,'Calotmul',31),(31009,'Cansahcab',31),(31010,'Cantamayec',31),(31011,'CelestÃºn',31),(31012,'Cenotillo',31),(31013,'Conkal',31),(31014,'Cuncunul',31),(31015,'CuzamÃ¡',31),(31016,'ChacsinkÃ­n',31),(31017,'Chankom',31),(31018,'Chapab',31),(31019,'Chemax',31),(31020,'Chicxulub Pueblo',31),(31021,'ChichimilÃ¡',31),(31022,'Chikindzonot',31),(31023,'ChocholÃ¡',31),(31024,'Chumayel',31),(31025,'DzÃ¡n',31),(31026,'Dzemul',31),(31027,'DzidzantÃºn',31),(31028,'Dzilam de Bravo',31),(31029,'Dzilam GonzÃ¡lez',31),(31030,'DzitÃ¡s',31),(31031,'Dzoncauich',31),(31032,'Espita',31),(31033,'HalachÃ³',31),(31034,'HocabÃ¡',31),(31035,'HoctÃºn',31),(31036,'HomÃºn',31),(31037,'HuhÃ­',31),(31038,'HunucmÃ¡',31),(31039,'Ixil',31),(31040,'Izamal',31),(31041,'KanasÃ­n',31),(31042,'Kantunil',31),(31043,'Kaua',31),(31044,'Kinchil',31),(31045,'KopomÃ¡',31),(31046,'Mama',31),(31047,'ManÃ­',31),(31048,'MaxcanÃº',31),(31049,'MayapÃ¡n',31),(31050,'MÃ©rida',31),(31051,'MocochÃ¡',31),(31052,'Motul',31),(31053,'Muna',31),(31054,'Muxupip',31),(31055,'OpichÃ©n',31),(31056,'Oxkutzcab',31),(31057,'PanabÃ¡',31),(31058,'Peto',31),(31059,'Progreso',31),(31060,'Quintana Roo',31),(31061,'RÃ­o Lagartos',31),(31062,'Sacalum',31),(31063,'Samahil',31),(31064,'Sanahcat',31),(31065,'San Felipe',31),(31066,'Santa Elena',31),(31067,'SeyÃ©',31),(31068,'SinanchÃ©',31),(31069,'Sotuta',31),(31070,'SucilÃ¡',31),(31071,'Sudzal',31),(31072,'Suma',31),(31073,'TahdziÃº',31),(31074,'Tahmek',31),(31075,'Teabo',31),(31076,'Tecoh',31),(31077,'Tekal de Venegas',31),(31078,'TekantÃ³',31),(31079,'Tekax',31),(31080,'Tekit',31),(31081,'Tekom',31),(31082,'Telchac Pueblo',31),(31083,'Telchac Puerto',31),(31084,'Temax',31),(31085,'TemozÃ³n',31),(31086,'TepakÃ¡n',31),(31087,'Tetiz',31),(31088,'Teya',31),(31089,'Ticul',31),(31090,'Timucuy',31),(31091,'Tinum',31),(31092,'Tixcacalcupul',31),(31093,'Tixkokob',31),(31094,'Tixmehuac',31),(31095,'TixpÃ©hual',31),(31096,'TizimÃ­n',31),(31097,'TunkÃ¡s',31),(31098,'Tzucacab',31),(31099,'Uayma',31),(31100,'UcÃº',31),(31101,'UmÃ¡n',31),(31102,'Valladolid',31),(31103,'Xocchel',31),(31104,'YaxcabÃ¡',31),(31105,'Yaxkukul',31),(31106,'YobaÃ­n',31),(32001,'Apozol',32),(32002,'Apulco',32),(32003,'Atolinga',32),(32004,'Benito JuÃ¡rez',32),(32005,'Calera',32),(32006,'CaÃ±itas de Felipe Pescador',32),(32007,'ConcepciÃ³n del Oro',32),(32008,'CuauhtÃ©moc',32),(32009,'Chalchihuites',32),(32010,'Fresnillo',32),(32011,'Trinidad GarcÃ­a de la Cadena',32),(32012,'Genaro Codina',32),(32013,'General Enrique Estrada',32),(32014,'General Francisco R. MurguÃ­a',32),(32015,'El Plateado de JoaquÃ­n Amaro',32),(32016,'General PÃ¡nfilo Natera',32),(32017,'Guadalupe',32),(32018,'Huanusco',32),(32019,'Jalpa',32),(32020,'Jerez',32),(32021,'JimÃ©nez del Teul',32),(32022,'Juan Aldama',32),(32023,'Juchipila',32),(32024,'Loreto',32),(32025,'Luis Moya',32),(32026,'Mazapil',32),(32027,'Melchor Ocampo',32),(32028,'Mezquital del Oro',32),(32029,'Miguel Auza',32),(32030,'Momax',32),(32031,'Monte Escobedo',32),(32032,'Morelos',32),(32033,'Moyahua de Estrada',32),(32034,'NochistlÃ¡n de MejÃ­a',32),(32035,'Noria de Ãngeles',32),(32036,'Ojocaliente',32),(32037,'PÃ¡nuco',32),(32038,'Pinos',32),(32039,'RÃ­o Grande',32),(32040,'Sain Alto',32),(32041,'El Salvador',32),(32042,'Sombrerete',32),(32043,'SusticacÃ¡n',32),(32044,'Tabasco',32),(32045,'TepechitlÃ¡n',32),(32046,'Tepetongo',32),(32047,'TeÃºl de GonzÃ¡lez Ortega',32),(32048,'Tlaltenango de SÃ¡nchez RomÃ¡n',32),(32049,'ValparaÃ­so',32),(32050,'Vetagrande',32),(32051,'Villa de Cos',32),(32052,'Villa GarcÃ­a',32),(32053,'Villa GonzÃ¡lez Ortega',32),(32054,'Villa Hidalgo',32),(32055,'Villanueva',32),(32056,'Zacatecas',32),(32057,'Trancoso',32),(32058,'Santa MarÃ­a de la Paz',32);
/*!40000 ALTER TABLE `Municipio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Promociones`
--

DROP TABLE IF EXISTS `Promociones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Promociones` (
  `id_promocion` int NOT NULL AUTO_INCREMENT,
  `nombre_promocion` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `descuento` decimal(5,2) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `activo` bit(1) DEFAULT b'1',
  `usos_maximos` int DEFAULT NULL,
  `usos_actuales` int DEFAULT '0',
  PRIMARY KEY (`id_promocion`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Promociones`
--

LOCK TABLES `Promociones` WRITE;
/*!40000 ALTER TABLE `Promociones` DISABLE KEYS */;
INSERT INTO `Promociones` VALUES (1,'Black Friday','Descuento especial del 20%',20.00,'2025-11-25','2025-11-30',_binary '',100,0),(2,'Navidad','Descuento navideÃ±o del 15%',15.00,'2025-12-10','2025-12-25',_binary '',50,0);
/*!40000 ALTER TABLE `Promociones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Seatsio_Config`
--

DROP TABLE IF EXISTS `Seatsio_Config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Seatsio_Config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `config_key` varchar(50) NOT NULL,
  `config_value` varchar(500) DEFAULT NULL,
  `descripcion` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `config_key` (`config_key`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Seatsio_Config`
--

LOCK TABLES `Seatsio_Config` WRITE;
/*!40000 ALTER TABLE `Seatsio_Config` DISABLE KEYS */;
INSERT INTO `Seatsio_Config` VALUES (1,'default_chart_key','b57c9e95-a0e3-303e-f2cb-984f80dbc62c','Chart key por defecto para nuevos eventos','2025-11-14 16:42:54','2025-11-14 17:45:08'),(2,'auto_create_events','1','Crear automÃ¡ticamente eventos en Seats.io (1=sÃ­, 0=no)','2025-11-14 16:42:54','2025-11-14 16:42:54');
/*!40000 ALTER TABLE `Seatsio_Config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Seatsio_Sync_Log`
--

DROP TABLE IF EXISTS `Seatsio_Sync_Log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Seatsio_Sync_Log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_type` enum('evento','funcion') NOT NULL,
  `entity_id` int NOT NULL,
  `seatsio_key` varchar(255) DEFAULT NULL,
  `action` enum('create','update','delete') NOT NULL,
  `success` tinyint(1) NOT NULL,
  `error_message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entity` (`entity_type`,`entity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Seatsio_Sync_Log`
--

LOCK TABLES `Seatsio_Sync_Log` WRITE;
/*!40000 ALTER TABLE `Seatsio_Sync_Log` DISABLE KEYS */;
INSERT INTO `Seatsio_Sync_Log` VALUES (1,'funcion',7,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:02:59'),(2,'funcion',8,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:02:59'),(3,'funcion',9,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:02:59'),(4,'funcion',3,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:02:59'),(5,'funcion',14,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:02:59'),(6,'funcion',12,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:03:00'),(7,'funcion',15,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:03:00'),(8,'funcion',2,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:03:00'),(9,'funcion',13,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:03:00'),(10,'funcion',4,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:03:00'),(11,'funcion',11,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:03:00'),(12,'funcion',1,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:03:00'),(13,'funcion',5,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:03:01'),(14,'funcion',6,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-15 05:03:01'),(15,'funcion',7,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:19'),(16,'funcion',8,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:20'),(17,'funcion',9,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:20'),(18,'funcion',3,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:20'),(19,'funcion',14,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:20'),(20,'funcion',12,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:20'),(21,'funcion',15,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:20'),(22,'funcion',2,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:20'),(23,'funcion',13,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:21'),(24,'funcion',4,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:21'),(25,'funcion',11,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:21'),(26,'funcion',1,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:21'),(27,'funcion',5,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:21'),(28,'funcion',6,NULL,'create',0,'Error al crear evento en Seats.io: Request failed with status code 400','2025-11-20 23:41:21');
/*!40000 ALTER TABLE `Seatsio_Sync_Log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sede`
--

DROP TABLE IF EXISTS `Sede`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sede` (
  `id_sede` int NOT NULL AUTO_INCREMENT,
  `nombre_sede` varchar(100) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `capacidad_total` int DEFAULT NULL,
  `activo` bit(1) DEFAULT b'1',
  PRIMARY KEY (`id_sede`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sede`
--

LOCK TABLES `Sede` WRITE;
/*!40000 ALTER TABLE `Sede` DISABLE KEYS */;
INSERT INTO `Sede` VALUES (1,'Arena Monterrey','Av. Fundidora 501','Monterrey','8122233344',15000,_binary ''),(2,'Teatro Diana','Av. 16 de Septiembre 710','Guadalajara','3334455566',2500,_binary ''),(3,'PabellÃ³n M','Fundidora Park, Av. Fundidora y Adolfo Prieto','Monterrey','8188880000',3500,_binary ''),(4,'Showcenter Complex','Av. ConstituciÃ³n 2000 Pte.','Monterrey','8188881111',5500,_binary '');
/*!40000 ALTER TABLE `Sede` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tipo_Boleto`
--

DROP TABLE IF EXISTS `Tipo_Boleto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tipo_Boleto` (
  `id_tipo_boleto` int NOT NULL AUTO_INCREMENT,
  `nombre_tipo` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `precio_base` decimal(10,2) DEFAULT NULL,
  `activo` bit(1) DEFAULT b'1',
  `id_zona` int NOT NULL,
  PRIMARY KEY (`id_tipo_boleto`),
  KEY `id_zona` (`id_zona`),
  CONSTRAINT `Tipo_Boleto_ibfk_1` FOREIGN KEY (`id_zona`) REFERENCES `Zonas` (`id_zona`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tipo_Boleto`
--

LOCK TABLES `Tipo_Boleto` WRITE;
/*!40000 ALTER TABLE `Tipo_Boleto` DISABLE KEYS */;
INSERT INTO `Tipo_Boleto` VALUES (1,'VIP Premium','Asiento en zona VIP',1500.00,_binary '',1),(2,'General','Asiento en zona general',500.00,_binary '',2),(3,'PabellÃ³n M - Floor VIP','Acceso a zona VIP del Floor',2800.00,_binary '',3),(4,'PabellÃ³n M - Floor General','Acceso a Floor General',1800.00,_binary '',4),(5,'PabellÃ³n M - Palcos','Acceso a Palcos',2500.00,_binary '',5),(6,'PabellÃ³n M - Gradas','Acceso a Gradas',1400.00,_binary '',6),(7,'PabellÃ³n M - BalcÃ³n Superior','Acceso a BalcÃ³n Superior',900.00,_binary '',7),(8,'Showcenter - Pista VIP','Acceso a Pista VIP',3200.00,_binary '',8),(9,'Showcenter - Pista General','Acceso a Pista General',2000.00,_binary '',9),(10,'Showcenter - SecciÃ³n 100','Acceso a Secciones nivel 100',1600.00,_binary '',10),(11,'Showcenter - SecciÃ³n 200','Acceso a Secciones nivel 200',1000.00,_binary '',11);
/*!40000 ALTER TABLE `Tipo_Boleto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tipo_Empleado`
--

DROP TABLE IF EXISTS `Tipo_Empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tipo_Empleado` (
  `id_tipo_empleado` int NOT NULL AUTO_INCREMENT,
  `nombre_tipo` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `salario_base` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_tipo_empleado`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tipo_Empleado`
--

LOCK TABLES `Tipo_Empleado` WRITE;
/*!40000 ALTER TABLE `Tipo_Empleado` DISABLE KEYS */;
INSERT INTO `Tipo_Empleado` VALUES (1,'Taquillero','Encargado de venta de boletos',8500.00),(2,'Administrador','Gestiona eventos y personal',15000.00),(3,'Superusuario','Control total del sistema',20000.00);
/*!40000 ALTER TABLE `Tipo_Empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tipo_Evento`
--

DROP TABLE IF EXISTS `Tipo_Evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tipo_Evento` (
  `id_tipo_evento` int NOT NULL AUTO_INCREMENT,
  `nombre_tipo` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `activo` bit(1) DEFAULT b'1',
  PRIMARY KEY (`id_tipo_evento`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tipo_Evento`
--

LOCK TABLES `Tipo_Evento` WRITE;
/*!40000 ALTER TABLE `Tipo_Evento` DISABLE KEYS */;
INSERT INTO `Tipo_Evento` VALUES (1,'Concierto','Eventos musicales en vivo',_binary ''),(2,'Obra de Teatro','Representaciones teatrales',_binary ''),(3,'Deportes','Eventos deportivos',_binary ''),(4,'Stand-Up Comedy','Shows de comedia',_binary ''),(5,'Festival','Festivales y eventos masivos',_binary ''),(6,'Conferencia','Charlas y conferencias',_binary '');
/*!40000 ALTER TABLE `Tipo_Evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Ventas`
--

DROP TABLE IF EXISTS `Ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Ventas` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `impuestos` decimal(10,2) DEFAULT NULL,
  `id_cliente` int NOT NULL,
  `id_empleado` int NOT NULL,
  `id_metodo` int NOT NULL,
  `id_promocion` int DEFAULT NULL,
  PRIMARY KEY (`id_venta`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_empleado` (`id_empleado`),
  KEY `id_metodo` (`id_metodo`),
  KEY `id_promocion` (`id_promocion`),
  CONSTRAINT `Ventas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `Clientes` (`id_cliente`),
  CONSTRAINT `Ventas_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `Empleado` (`id_empleado`),
  CONSTRAINT `Ventas_ibfk_3` FOREIGN KEY (`id_metodo`) REFERENCES `Metodo_Pago` (`id_metodo`),
  CONSTRAINT `Ventas_ibfk_4` FOREIGN KEY (`id_promocion`) REFERENCES `Promociones` (`id_promocion`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ventas`
--

LOCK TABLES `Ventas` WRITE;
/*!40000 ALTER TABLE `Ventas` DISABLE KEYS */;
INSERT INTO `Ventas` VALUES (1,'2025-11-05',2400.00,384.00,1,1,1,1),(2,'2025-11-06',500.00,80.00,2,1,2,NULL),(3,'2025-11-20',1000.00,NULL,3,1,1,NULL),(4,'2025-11-20',1000.00,NULL,3,1,1,NULL),(5,'2025-11-20',1000.00,NULL,3,1,1,NULL),(6,'2025-11-20',1000.00,NULL,3,1,1,NULL),(7,'2025-11-20',1000.00,NULL,3,1,1,NULL),(8,'2025-11-20',1000.00,NULL,3,1,1,NULL),(9,'2025-11-20',1000.00,NULL,3,1,1,NULL),(10,'2025-11-20',1000.00,NULL,3,1,1,NULL);
/*!40000 ALTER TABLE `Ventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Zonas`
--

DROP TABLE IF EXISTS `Zonas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Zonas` (
  `id_zona` int NOT NULL AUTO_INCREMENT,
  `nombre_zona` varchar(100) NOT NULL,
  `capacidad` int DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `precio_multiplicador` decimal(5,2) DEFAULT '1.00',
  `id_auditorio` int NOT NULL,
  PRIMARY KEY (`id_zona`),
  KEY `id_auditorio` (`id_auditorio`),
  CONSTRAINT `Zonas_ibfk_1` FOREIGN KEY (`id_auditorio`) REFERENCES `Auditorio` (`id_auditorio`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Zonas`
--

LOCK TABLES `Zonas` WRITE;
/*!40000 ALTER TABLE `Zonas` DISABLE KEYS */;
INSERT INTO `Zonas` VALUES (1,'VIP',500,'Zona preferente',2.00,1),(2,'General',11500,'Zona general',1.00,1),(3,'Floor VIP',156,'Zona mÃ¡s cercana al escenario - VIP',2.00,3),(4,'Floor General',248,'Zona principal de pie',1.50,3),(5,'Palcos',168,'Palcos laterales con asiento',2.00,3),(6,'Gradas',486,'Gradas con asiento numerado',1.50,3),(7,'BalcÃ³n Superior',310,'Zona alta con vista general',1.00,3),(8,'Pista VIP',226,'Pista VIP mÃ¡s cercana',2.50,4),(9,'Pista General',374,'Pista general de pie',1.80,4),(10,'Secciones 100',880,'Secciones numeradas nivel 100',1.50,4),(11,'Secciones 200',1140,'Secciones numeradas nivel 200',1.00,4);
/*!40000 ALTER TABLE `Zonas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-23  1:38:01

