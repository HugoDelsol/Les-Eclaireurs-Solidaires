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

### Structure & Frameworks
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

## 📐 Architecture du Projet
L'application suit une architecture **MVC** (Modèle-Vue-Contrôleur), garantissant une séparation des responsabilités et une bonne maintenabilité :

```text
.
└── site
    └── src
        ├── config/          # Configurations globales (Base de données, variables d'environnement)
        ├── controllers/     # Logique métier divisée par domaines
        │   ├── mission/     # Gestion des actions liées aux missions
        │   └── user/        # Gestion des profils et des utilisateurs
        ├── cron/            # Tâches planifiées en arrière-plan (Node-Cron)
        ├── logs/            # Fichiers de suivi et de debug de l'application
        ├── middleware/      # Middlewares de sécurité (Authentification, sessions, sanitization)
        ├── models/          # Modèles MySQL et requêtes SQL préparées
        ├── public/          # Ressources statiques accessibles par le client
        │   ├── javaScript/  # Scripts JS côté client (Vanilla)
        │   ├── pictures/    # Assets visuels organisés par catégories
        │   │   ├── Reviews/
        │   │   ├── backGroundCards/
        │   │   ├── globalIcons/
        │   │   ├── homePage/
        │   │   ├── iconHeader-Footer/
        │   │   ├── logoV2/
        │   │   └── mobile_account/
        │   └── style/       # Feuilles de style CSS découpées par modules
        │       ├── account/
        │       ├── connection/
        │       ├── home/
        │       └── modal/
        ├── routes/          # Définition des points d'entrée et aiguillage des requêtes
        ├── services/        # Services transversaux (Envoi d'emails, traitements tiers)
        ├── utils/           # Fonctions utilitaires et outils d'aide au développement
        └── views/           # Interfaces graphiques (Fichiers EJS)
            ├── account/     # Vues des espaces utilisateurs
            │   ├── admin/   # Interfaces spécifiques à l'Administrateur
            │   └── volunteer/ # Interfaces dédiées aux Bénévoles
            ├── connection/  # Pages de connexion et d'inscription
            ├── home/        # Page d'accueil de la plateforme
            ├── legals/      # Mentions légales et RGPD
            ├── messaging/   # Interfaces du système de messagerie interne
            ├── modals/      # Fenêtres modales contextuelles
            └── partials/    # Composants réutilisables (Header, Footer, Navbar)
```

## 🛡️ Sécurité par Design

La sécurité a été placée au centre du développement de la plateforme afin de protéger les données des utilisateurs et garantir l'intégrité du système :

* **Prévention des Injections SQL** : Utilisation exclusive de requêtes paramétrées et préparées via le pilote MySQL dans les couches *Models*. Aucune concaténation de variables n'est effectuée dans les requêtes.
* **Protection contre les failles XSS** : Mise en place de middlewares de nettoyage (*sanitization*) pour filtrer, échapper et valider rigoureusement toutes les entrées utilisateurs issues des formulaires avant traitement.
* **Authentification & Contrôle d'Accès** : Gestion stricte des sessions utilisateurs. Des middlewares dédiés interceptent les requêtes sur les routes sensibles pour vérifier les privilèges avant d'autoriser l'accès aux interfaces `admin` ou `volunteer`.

## 📸 Aperçu de l'Interface

> 💡 *Les visuels ci-dessous illustrent l'ergonomie et les composants de la plateforme finale.*

| Espace Administrateur (Gestion & Supervision) | Espace Bénévole (Recherche & Engagement) |
| :---: | :---: |
| ![Dashboard Administrateur](./site/src/public/pictures/homePage/admin_preview.png) | ![Espace Bénévole](./site/src/public/pictures/homePage/volunteer_preview.png) |

---
## 👥 Guide d'Utilisation Réduits

### 🧑‍💼 Espace Administrateur
1. **Connexion** : Connectez-vous avec vos identifiants disposant du rôle d'administration.
2. **Gestion des Missions** : Accédez au panneau de contrôle pour publier une nouvelle mission, modifier les informations d'un événement existant etc...
3. **Modération** : Consultez la liste des membres inscrits pour superviser les accès à la plateforme.

### 🏃‍♂️ Espace Bénévole
1. **Inscription / Connexion** : Créez un compte bénévole ou connectez-vous à votre espace personnel.
2. **Recherche de Missions** : Parcourez le catalogue des missions publiées par l'association et affinez l'affichage grâce aux filtres thématiques.
3. **Engagement & Messagerie** : Rejoignez une mission en un clic et utilisez le système de messagerie interne pour échanger en direct avec les organisateurs.

---

## 🧪 Validation & Tests

Pour valider le comportement fonctionnel du projet, une série de vérifications a été opérée :
* **Tests de validation des formulaires** : Contrôles aux frontières sur les champs de saisie côté client (HTML5 / JavaScript) doublés d'une validation stricte côté serveur.
* **Tests d'intégration des tâches planifiées** : Contrôle du déclenchement et de l'exécution des routines en arrière-plan gérées par `Node-Cron`.

---

## 🚀 Post-Déploiement : Commandes Globales

Suite à l'exécution du script d'automatisation `.sh` sur le VPS OVHcloud, l'environnement de production génère automatiquement le fichier de suivi `commands.md` à la racine pour guider la maintenance. En voici le résumé des commandes applicatives majeures :

* **Lancement de l'environnement applicatif** : `npm start`
* **Lancement en mode de surveillance (Développement)** : `npm run dev`
* **Restauration ou initialisation de la base de données** : `mysql -u [user] -p [database_name] < site/src/config/schema.sql`
---
**Développé par Hugo Delsol** *Formation DWWM - M2i Formation*
