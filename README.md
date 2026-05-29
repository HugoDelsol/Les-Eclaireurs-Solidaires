# Les Éclaireurs Solidaires 🤝

**Les Éclaireurs Solidaires** est une plateforme de gestion de missions destinée aux bénévoles d'une association. L'objectif est d'offrir un outil simple et intuitif pour la publication de missions tout en permettant aux volontaires de s'engager et de suivre leurs actions dans le temps.

## 📋 Présentation du Projet
Ce projet "fil rouge" est réalisé dans le cadre de la formation **Développeur Web et Web Mobile** chez **M2i Formation** (2025-2026). Il répond à un besoin de centralisation pour faciliter la communication entre les administrateurs d'une structure associative et ses membres actifs.

### Fonctionnalités clés :
* **Espace Administrateur** : Gestion complète des missions (création, modification, suppression) et supervision de la liste des bénévoles.
* **Espace Bénévole** : Consultation des missions disponibles, filtrage par thématique et accès à un historique d'engagements.
* **Messagerie Interne** : Système de messagerie mis en place pour fluidifier les échanges directs entre les membres de la plateforme.
* **Rappels Automatisés** : Planification de tâches de rappel de missions via **Node-Cron** pour notifier automatiquement les bénévoles.
* **Interface Responsive** : Adaptation du contenu et de la navigation pour les supports mobiles, tablettes et desktop.

> 🏁 **Note :** Ce projet correspond à la version finale livrée pour l'examen. L'application répondant aux exigences du cahier des charges principal, certaines fonctionnalités secondaires ou documentations annexes ont été volontairement laissées de côté ou pourront être intégrées lors de futures évolutions.

## 🛠️ Environnement Technique & Déploiement

### Architecture & Frameworks
Le projet est structuré selon une architecture **MVC** (Modèle-Vue-Contrôleur) pour garantir la maintenance et la séparation des responsabilités.

* **IDE** : Visual Studio Code.
* **Back-end** : Node.js avec le framework **Express**.
* **Front-end** : JavaScript Vanilla (avec le moteur de template EJS).
* **Base de données** : MySQL.
* **Gestion de versions** : Git (Workflow : main, dev, feature, tests).

### Environnement de Développement
* **Conteneurisation & Outils** : Docker et Docker Compose (services isolés pour Node.js, l'image **MySQL**, et l'image **phpMyAdmin** pour l'administration graphique de la base de données en local).

### Environnement de Production & Déploiement
* **Hébergement** : Serveur Virtuel Privé (**VPS**) chez **OVHcloud**.
* **Déploiement** : Automatisé via un script shell (`.sh`) pour l'installation, la configuration et la mise en production sur le VPS.
---
**Développé par Hugo Delsol** *Formation DWWM - M2i Formation*
