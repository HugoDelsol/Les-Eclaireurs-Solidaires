-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql
-- Généré le : sam. 30 mai 2026 à 20:14
-- Version du serveur : 8.0.43
-- Version de PHP : 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `filRougeNodeJs_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int NOT NULL,
  `admin_first_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `admin_last_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `admin_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `admin_adress` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `admin_phone_number` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `admin_birthday` date DEFAULT NULL,
  `_id_admin_role` int DEFAULT NULL,
  `_id_city` int DEFAULT NULL,
  `_id_identifier` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `admin_role`
--

CREATE TABLE `admin_role` (
  `id_admin_role` int NOT NULL,
  `role_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admin_role`
--

INSERT INTO `admin_role` (`id_admin_role`, `role_name`, `description`) VALUES
(1, 'super_admin', 'Contrôle total sur le site, peut gérer tous les admins et modifier la configuration globale.'),
(2, 'admin', 'Gère le contenu et les utilisateurs standard, mais ne peut pas toucher aux superadmins.');

-- --------------------------------------------------------

--
-- Structure de la table `chat_channel`
--

CREATE TABLE `chat_channel` (
  `id_chat_channel` int NOT NULL,
  `chat_channel_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `chat_channel_object` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `chat_message`
--

CREATE TABLE `chat_message` (
  `id_chat_message` int NOT NULL,
  `chat_message_content` text NOT NULL,
  `chat_message_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `chat_message_status` tinyint(1) NOT NULL DEFAULT '0',
  `_id_user` int NOT NULL,
  `_id_admin` int DEFAULT NULL,
  `chat_message_from_user` tinyint(1) NOT NULL,
  `_id_chat_channel` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `city`
--

CREATE TABLE `city` (
  `id_city` int NOT NULL,
  `city_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `city_postal_code` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `_id_region` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `city`
--
INSERT INTO `city` (`id_city`, `city_name`, `city_postal_code`, `_id_region`) VALUES
(1, 'Paris', '75000', 13),
(2, 'Marseille', '13000', 3),
(3, 'Lyon', '69000', 1),
(4, 'Toulouse', '31000', 5),
(5, 'Nice', '06000', 3),
(6, 'Nantes', '44000', 12),
(7, 'Montpellier', '34000', 5),
(8, 'Strasbourg', '67000', 4),
(9, 'Bordeaux', '33000', 7),
(10, 'Lille', '59000', 2),
(11, 'Rennes', '35000', 10),
(12, 'Reims', '51100', 4),
(13, 'Le Havre', '76600', 6),
(14, 'Saint-Étienne', '42000', 1),
(15, 'Toulon', '83000', 3),
(16, 'Grenoble', '38000', 1),
(17, 'Dijon', '21000', 9),
(18, 'Angers', '49000', 12),
(19, 'Nîmes', '30000', 5),
(20, 'Villeurbanne', '69100', 1),
(21, 'Clermont-Ferrand', '63000', 1),
(22, 'Le Mans', '72000', 12),
(23, 'Aix-en-Provence', '13080', 3),
(24, 'Brest', '29200', 10),
(25, 'Limoges', '87000', 7),
(26, 'Tours', '37000', 8),
(27, 'Amiens', '80000', 2),
(28, 'Perpignan', '66000', 5),
(29, 'Metz', '57000', 4),
(30, 'Boulogne-Billancourt', '92100', 13),
(31, 'Orléans', '45000', 8),
(32, 'Mulhouse', '68100', 4),
(33, 'Rouen', '76000', 6),
(34, 'Caen', '14000', 6),
(35, 'Nancy', '54000', 4),
(36, 'Saint-Denis', '93200', 13),
(37, 'Argenteuil', '95100', 13),
(38, 'Montreuil', '93100', 13),
(39, 'Roubaix', '59100', 2),
(40, 'Tourcoing', '59200', 2),
(41, 'Nanterre', '92000', 13),
(42, 'Avignon', '84000', 3),
(43, 'Vitry-sur-Seine', '94400', 13),
(44, 'Créteil', '94000', 13),
(45, 'Poitiers', '86000', 7),
(46, 'Dunkerque', '59140', 2),
(47, 'Asnières-sur-Seine', '92600', 13),
(48, 'Courbevoie', '92400', 13),
(49, 'Versailles', '78000', 13),
(50, 'Colombes', '92700', 13),
(51, 'Aulnay-sous-Bois', '93600', 13),
(52, 'Rueil-Malmaison', '92500', 13),
(53, 'Champigny-sur-Marne', '94500', 13),
(54, 'Saint-Maur-des-Fossés', '94100', 13),
(55, 'Drancy', '93700', 13),
(56, 'Ajaccio', '20000', 11),
(57, 'Bastia', '20200', 11),
(58, 'Pau', '64000', 7),
(59, 'La Rochelle', '17000', 7),
(60, 'Calais', '62100', 2),
(61, 'Annecy', '74000', 1),
(62, 'Bayonne', '64100', 7),
(63, 'Bourges', '18000', 8),
(64, 'Béziers', '34500', 5),
(65, 'Cannes', '06400', 3),
(66, 'Antibes', '06600', 3),
(67, 'La Seyne-sur-Mer', '83500', 3),
(68, 'Noisy-le-Grand', '93160', 13),
(69, 'Levallois-Perret', '92300', 13),
(70, 'Neuilly-sur-Seine', '92200', 13),
(71, 'Clichy', '92110', 13),
(72, 'Ivry-sur-Seine', '94200', 13),
(73, 'Villejuif', '94800', 13),
(74, 'Évry-Courcouronnes', '91000', 13),
(75, 'Pessac', '33600', 7),
(76, 'Mérignac', '33700', 7),
(77, 'Saint-Nazaire', '44600', 12),
(78, 'Cholet', '49300', 12),
(79, 'Niort', '79000', 7),
(80, 'Albi', '81000', 5),
(81, 'Tarbes', '65000', 5),
(82, 'Narbonne', '11100', 5),
(83, 'Sète', '34200', 5),
(84, 'Colmar', '68000', 4),
(85, 'Thionville', '57100', 4),
(86, 'Chambéry', '73000', 1),
(87, 'Valence', '26000', 1),
(88, 'Vannes', '56000', 10),
(89, 'Lorient', '56100', 10),
(90, 'Quimper', '29000', 10),
(91, 'Fréjus', '83600', 3),
(92, 'Hyères', '83400', 3),
(93, 'Saint-Quentin', '02100', 2),
(94, 'Béthune', '62400', 2),
(95, 'Lens', '62300', 2),
(96, 'Arras', '62000', 2),
(97, 'Chartres', '28000', 8),
(98, 'Blois', '41000', 8),
(99, 'Chalon-sur-Saône', '71100', 9),
(100, 'Mâcon', '71000', 9);


-- --------------------------------------------------------

--
-- Structure de la table `history_mission`
--

CREATE TABLE `history_mission` (
  `id_history_mission` int NOT NULL,
  `_id_user` int DEFAULT NULL,
  `_id_mission` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `identifier`
--

CREATE TABLE `identifier` (
  `id_identifier` int NOT NULL,
  `identifier_mail` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `identifier_password` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `message_form`
--

CREATE TABLE `message_form` (
  `id_message_form` int NOT NULL,
  `name_form` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email_form` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `message_text_form` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_sent_message_form` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `message_recall_template`
--

CREATE TABLE `message_recall_template` (
  `id_message_recall_template` int NOT NULL,
  `message_object` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `message_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `message_label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `message_recall_template`
--

INSERT INTO `message_recall_template` (`id_message_recall_template`, `message_object`, `message_content`, `message_label`) VALUES
(2, 'Rappel – Votre mission approche', 'Salut !\r\n\r\nLe grand jour approche ! On a hâte de vous retrouver pour notre mission \"{{mission}}\" qui aura lieu le :\r\n\r\n📅 {{date}} \r\n🕘 Rendez-vous à {{heure}}\r\n📍 Lieu : {{lieu}}\r\n\r\nPour que tout se passe au mieux, pensez simplement à bien vous munir de votre carte d\'identité, car elle vous sera demandée dès votre arrivée. 🪪\r\n\r\nOn compte sur vous ! Merci de nous confirmer votre présence en répondant directement à ce mail. Ça nous aide énormément pour l\'organisation ! 🙌\r\n\r\nOn se voit bientôt ? 😊\r\n\r\nChaleureusement,\r\n\r\nL\'équipe Éclaireurs 🌟', 'emailMessage'),
(3, '', 'Bonjour {{prenom}}, votre mission \"{{mission}}\" est prévue le {{date}} à {{heure}}. Lieu : {{lieu}}. Merci de confirmer votre disponibilité.\r\n', 'smsMessage'),
(4, 'Rappel de mission', 'Bonjour {{prenom}},  \nVotre mission \"{{mission}}\" est prévue le {{date}} à {{heure}}.  \nLieu : {{lieu}}  \nResponsable : {{responsable}}  \n\nMerci de confirmer votre disponibilité via votre espace personnel.\n', 'pushMessage');

-- --------------------------------------------------------

--
-- Structure de la table `mission`
--

CREATE TABLE `mission` (
  `id_mission` int NOT NULL,
  `mission_title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mission_date` date NOT NULL,
  `mission_start_time` time NOT NULL,
  `mission_end_time` time NOT NULL,
  `mission_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mission_place_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mission_available_place` smallint NOT NULL,
  `mission_img` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `_id_mission_category` int NOT NULL,
  `_id_city` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `mission_category`
--

CREATE TABLE `mission_category` (
  `id_mission_category` int NOT NULL,
  `mission_category_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `mission_category`
--

INSERT INTO `mission_category` (`id_mission_category`, `mission_category_name`) VALUES
(1, 'Éducation & Tutorat'),
(2, 'Santé & Bien-être'),
(3, 'Environnement & Nature'),
(4, 'Solidarité & Action sociale'),
(5, 'Culture & Loisirs'),
(6, 'Urgence & Secours'),
(7, 'Sport & Loisirs'),
(8, 'Technologie & Numérique'),
(9, 'International & Humanitaire'),
(10, 'Recherche & Innovation sociale');

-- --------------------------------------------------------

--
-- Structure de la table `mission_image`
--

CREATE TABLE `mission_image` (
  `id_mission_image` int NOT NULL,
  `mission_image_url` varchar(500) NOT NULL,
  `_id_mission_category` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `mission_image`
--

INSERT INTO `mission_image` (`id_mission_image`, `mission_image_url`, `_id_mission_category`) VALUES
(2, 'https://images.unsplash.com/photo-1758525861568-ddaf9c5f7ee6?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 1),
(3, 'https://plus.unsplash.com/premium_photo-1661964298925-b3ea464fc9b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8JUMzJTg5ZHVjYXRpb24lMjAlMjYlMjBUdXRvcmF0fGVufDB8fDB8fHww', 1),
(4, 'https://images.unsplash.com/photo-1758685733907-42e9651721f5?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 1),
(5, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12131/conversions/sante-pour-tous-9-small.jpg?v=1737022121', 2),
(6, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12131/conversions/sante-pour-tous-9-small.jpg?v=1737022121', 2),
(7, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/8491/conversions/YnorfN0Xqr7FlXc-small.jpg?v=1737369558', 2),
(8, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/59852/conversions/CeGeyaxCt6QoAcV6l0WrhwJswQo1sK-small.jpg?v=1737022288', 3),
(9, 'https://plus.unsplash.com/premium_photo-1664811569310-04a7c276df1c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 3),
(10, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/83980/conversions/EMM2Cf3yaSc4KVRHdKG5rUbsuhBgae-small.jpg?v=1737022302', 3),
(11, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12137/conversions/prevention-et-protection-6-small.jpg?v=1737022139', 4),
(12, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/16512/conversions/T3Zcag5cuAbpxOysr6IlESeAEQtWNG-small.jpg?v=1750858530', 4),
(13, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12167/conversions/solidarite-et-insertion-3-small.jpg?v=1737022224', 4),
(14, 'https://images.unsplash.com/photo-1463592177119-bab2a00f3ccb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 5),
(15, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/59791/conversions/meGVwCCzxmwRfTmvWX3xv4Z23sXwjS-small.jpg?v=1737022262', 5),
(16, 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 5),
(17, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/59833/conversions/IwNqwbLlS145s4cv2OY83Loz3eOfQU-small.jpg?v=1737022134', 6),
(18, 'https://images.unsplash.com/photo-1722974180453-305758503804?q=80&w=1101&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 6),
(19, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12132/conversions/iq9zO1xVoKW7lDad6LxvI1qwjlDD0O-small.jpg?v=1746617755', 6),
(20, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/56406/conversions/dxuVmMYyWi7kHGXIPKc08qniPbiUny-small.jpg?v=1737022182', 7),
(21, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/8499/conversions/ksa0J6PYwh8hODt-small.jpg?v=1737369561', 7),
(22, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/101352/conversions/29X3xhVeaRSe1oPMK5uZOUNpQkvHag-small.jpg?v=1747053589', 7),
(23, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/8472/conversions/NWgtGWKGTNDkrGh-small.jpg?v=1737369548', 8),
(24, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/83963/conversions/KDot4RBkNqSbKiKPk0EywJ0OqXn7HN-small.jpg?v=1737022156', 8),
(25, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/16512/conversions/T3Zcag5cuAbpxOysr6IlESeAEQtWNG-small.jpg?v=1750858530', 8),
(26, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/38567/conversions/4PAYs5Pbj3MtBMD8Ti9iO0GS443a1H-small.jpg?v=1737369630', 9),
(27, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/73396/conversions/BpyfCWru61ng8kQIeB7r83ARBQNsPG-small.jpg?v=1737369680', 9),
(28, 'https://www.jeveuxaider.gouv.fr/images/card-thumbnail-default.jpg', 9),
(29, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/16695/conversions/s4oQeun6RPeBuFm0MygXVyBKp3kzMz-small.jpg?v=1737369602', 10),
(30, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/8475/conversions/a26fP7ibvc7fB1r-small.jpg?v=1737369547', 10),
(31, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/35545/conversions/N1eQNdmYjhYWFJt69XxtuHek9CoV2f-small.jpg?v=1737369626', 10),
(32, 'https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12150/conversions/sport-pour-tous-1-small.jpg?v=1737022185', 10);

-- --------------------------------------------------------

--
-- Structure de la table `region`
--

CREATE TABLE `region` (
  `id_region` int NOT NULL,
  `region_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `region`
--

INSERT INTO `region` (`id_region`, `region_name`) VALUES
(1, 'Auvergne-Rhône-Alpes'),
(9, 'Bourgogne-Franche-Comté'),
(10, 'Bretagne'),
(8, 'Centre-Val de Loire'),
(11, 'Corse'),
(4, 'Grand Est'),
(14, 'Guadeloupe'),
(16, 'Guyane'),
(2, 'Hauts-de-France'),
(13, 'Île-de-France'),
(17, 'La Réunion'),
(15, 'Martinique'),
(19, 'Mayotte'),
(6, 'Normandie'),
(7, 'Nouvelle-Aquitaine'),
(18, 'Nouvelle-Calédonie'),
(5, 'Occitanie'),
(12, 'Pays de la Loire'),
(3, 'Provence-Alpes-Côte d\'Azur');

-- --------------------------------------------------------

--
-- Structure de la table `registration_mission`
--

CREATE TABLE `registration_mission` (
  `id_registration` int NOT NULL,
  `registration_mission_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `registration_mission_recall_send` tinyint NOT NULL DEFAULT '0',
  `_id_user` int NOT NULL,
  `_id_mission` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id_user` int NOT NULL,
  `user_first_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_last_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_adress` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_phone_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `_id_category` int DEFAULT NULL,
  `_id_city` int DEFAULT NULL,
  `_id_identifier` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_opinion`
--

CREATE TABLE `user_opinion` (
  `id_user_opinion` int NOT NULL,
  `user_opinion_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_opinion_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `_id_user` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`),
  ADD KEY `_id_city` (`_id_city`),
  ADD KEY `_id_identifier` (`_id_identifier`);

--
-- Index pour la table `admin_role`
--
ALTER TABLE `admin_role`
  ADD PRIMARY KEY (`id_admin_role`);

--
-- Index pour la table `chat_channel`
--
ALTER TABLE `chat_channel`
  ADD PRIMARY KEY (`id_chat_channel`);

--
-- Index pour la table `chat_message`
--
ALTER TABLE `chat_message`
  ADD PRIMARY KEY (`id_chat_message`),
  ADD KEY `fk_msg_user` (`_id_user`),
  ADD KEY `fk_msg_admin` (`_id_admin`),
  ADD KEY `fk_msg_channel` (`_id_chat_channel`);

--
-- Index pour la table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`id_city`),
  ADD KEY `id_region` (`_id_region`);

--
-- Index pour la table `history_mission`
--
ALTER TABLE `history_mission`
  ADD PRIMARY KEY (`id_history_mission`),
  ADD KEY `_id_user` (`_id_user`);

--
-- Index pour la table `identifier`
--
ALTER TABLE `identifier`
  ADD PRIMARY KEY (`id_identifier`);

--
-- Index pour la table `message_form`
--
ALTER TABLE `message_form`
  ADD PRIMARY KEY (`id_message_form`);

--
-- Index pour la table `message_recall_template`
--
ALTER TABLE `message_recall_template`
  ADD PRIMARY KEY (`id_message_recall_template`);

--
-- Index pour la table `mission`
--
ALTER TABLE `mission`
  ADD PRIMARY KEY (`id_mission`),
  ADD KEY `_id_city` (`_id_city`),
  ADD KEY `_id_mission_category` (`_id_mission_category`);

--
-- Index pour la table `mission_category`
--
ALTER TABLE `mission_category`
  ADD PRIMARY KEY (`id_mission_category`);

--
-- Index pour la table `mission_image`
--
ALTER TABLE `mission_image`
  ADD PRIMARY KEY (`id_mission_image`),
  ADD KEY `_id_mission_category` (`_id_mission_category`);

--
-- Index pour la table `region`
--
ALTER TABLE `region`
  ADD PRIMARY KEY (`id_region`),
  ADD UNIQUE KEY `region_name` (`region_name`);

--
-- Index pour la table `registration_mission`
--
ALTER TABLE `registration_mission`
  ADD PRIMARY KEY (`id_registration`),
  ADD KEY `_id_user` (`_id_user`),
  ADD KEY `_id_mission` (`_id_mission`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD KEY `_id_city` (`_id_city`),
  ADD KEY `_id_identifier` (`_id_identifier`),
  ADD KEY `_id_category` (`_id_category`);

--
-- Index pour la table `user_opinion`
--
ALTER TABLE `user_opinion`
  ADD PRIMARY KEY (`id_user_opinion`),
  ADD KEY `_id_user` (`_id_user`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `admin_role`
--
ALTER TABLE `admin_role`
  MODIFY `id_admin_role` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `chat_channel`
--
ALTER TABLE `chat_channel`
  MODIFY `id_chat_channel` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `chat_message`
--
ALTER TABLE `chat_message`
  MODIFY `id_chat_message` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `city`
--
ALTER TABLE `city`
  MODIFY `id_city` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39202;

--
-- AUTO_INCREMENT pour la table `history_mission`
--
ALTER TABLE `history_mission`
  MODIFY `id_history_mission` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `identifier`
--
ALTER TABLE `identifier`
  MODIFY `id_identifier` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `message_form`
--
ALTER TABLE `message_form`
  MODIFY `id_message_form` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `message_recall_template`
--
ALTER TABLE `message_recall_template`
  MODIFY `id_message_recall_template` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `mission`
--
ALTER TABLE `mission`
  MODIFY `id_mission` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `mission_category`
--
ALTER TABLE `mission_category`
  MODIFY `id_mission_category` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `mission_image`
--
ALTER TABLE `mission_image`
  MODIFY `id_mission_image` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `region`
--
ALTER TABLE `region`
  MODIFY `id_region` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT pour la table `registration_mission`
--
ALTER TABLE `registration_mission`
  MODIFY `id_registration` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user_opinion`
--
ALTER TABLE `user_opinion`
  MODIFY `id_user_opinion` int NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_3` FOREIGN KEY (`_id_identifier`) REFERENCES `identifier` (`id_identifier`);

--
-- Contraintes pour la table `chat_message`
--
ALTER TABLE `chat_message`
  ADD CONSTRAINT `fk_msg_admin` FOREIGN KEY (`_id_admin`) REFERENCES `admin` (`id_admin`),
  ADD CONSTRAINT `fk_msg_channel` FOREIGN KEY (`_id_chat_channel`) REFERENCES `chat_channel` (`id_chat_channel`),
  ADD CONSTRAINT `fk_msg_user` FOREIGN KEY (`_id_user`) REFERENCES `user` (`id_user`);

--
-- Contraintes pour la table `city`
--
ALTER TABLE `city`
  ADD CONSTRAINT `city_ibfk_1` FOREIGN KEY (`_id_region`) REFERENCES `region` (`id_region`);

--
-- Contraintes pour la table `history_mission`
--
ALTER TABLE `history_mission`
  ADD CONSTRAINT `history_mission_ibfk_1` FOREIGN KEY (`_id_user`) REFERENCES `user` (`id_user`);

--
-- Contraintes pour la table `mission`
--
ALTER TABLE `mission`
  ADD CONSTRAINT `mission_ibfk_1` FOREIGN KEY (`_id_city`) REFERENCES `city` (`id_city`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `mission_ibfk_2` FOREIGN KEY (`_id_mission_category`) REFERENCES `mission_category` (`id_mission_category`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Contraintes pour la table `mission_image`
--
ALTER TABLE `mission_image`
  ADD CONSTRAINT `mission_image_ibfk_1` FOREIGN KEY (`_id_mission_category`) REFERENCES `mission_category` (`id_mission_category`);

--
-- Contraintes pour la table `registration_mission`
--
ALTER TABLE `registration_mission`
  ADD CONSTRAINT `registration_mission_ibfk_1` FOREIGN KEY (`_id_user`) REFERENCES `user` (`id_user`),
  ADD CONSTRAINT `registration_mission_ibfk_2` FOREIGN KEY (`_id_mission`) REFERENCES `mission` (`id_mission`);

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`_id_identifier`) REFERENCES `identifier` (`id_identifier`),
  ADD CONSTRAINT `user_ibfk_3` FOREIGN KEY (`_id_category`) REFERENCES `mission_category` (`id_mission_category`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_ibfk_4` FOREIGN KEY (`_id_city`) REFERENCES `city` (`id_city`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Contraintes pour la table `user_opinion`
--
ALTER TABLE `user_opinion`
  ADD CONSTRAINT `user_opinion_ibfk_1` FOREIGN KEY (`_id_user`) REFERENCES `user` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
