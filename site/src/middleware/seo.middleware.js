const seoMap = {
    '/home': {
        seoTitle: "Accueil - Les Éclaireurs Solidaires",
        metaName: "description",
        metaContent: "Découvrez Les Éclaireurs Solidaires, une communauté engagée qui agit pour la solidarité et l'entraide au quotidien."
    },
    '/becomeVolunteer': {
        seoTitle: "Devenir bénévole - Les Éclaireurs Solidaires",
        metaName: "description",
        metaContent: "Rejoignez Les Éclaireurs Solidaires et engagez-vous en tant que bénévole pour aider des personnes dans le besoin près de chez vous."
    },
    '/detailMission': {
        seoTitle: "Détail d'une mission - Les Éclaireurs Solidaires",
        metaName: "description",
        metaContent: "Consultez les détails d'une mission solidaire, ses objectifs, ses besoins et les modalités pour y participer."
    },
    '/privacyPolicy': {
        seoTitle: "Politique de confidentialité - Les Éclaireurs Solidaires",
        metaName: "description",
        metaContent: "Consultez la politique de confidentialité des Éclaireurs Solidaires et découvrez comment vos données sont protégées."
    },
    '/termsAndConditions': {
        seoTitle: "Conditions générales d'utilisation - Les Éclaireurs Solidaires",
        metaName: "description",
        metaContent: "Prenez connaissance des conditions d'utilisation du site Les Éclaireurs Solidaires et de vos droits et obligations."
    },
    '/legalNotice': {
        seoTitle: "Mentions légales - Les Éclaireurs Solidaires",
        metaName: "description",
        metaContent: "Retrouvez les informations légales concernant l'éditeur du site, l'hébergement et les responsabilités."
    },
    '/siteMap': {
        seoTitle: "Plan du site - Les Éclaireurs Solidaires",
        metaName: "description",
        metaContent: "Accédez à l'ensemble des pages du site Les Éclaireurs Solidaires grâce au plan du site."
    },
    '/signUp': {
        seoTitle: "Inscription - Les Éclaireurs Solidaires",
        metaName: "description",
        metaContent: "Créez un compte sur Les Éclaireurs Solidaires pour rejoindre la communauté et participer aux actions solidaires."
    },
    '/signIn': {
        seoTitle: "Connexion - Les Éclaireurs Solidaires",
        metaName: "description",
        metaContent: "Connectez-vous à votre compte Les Éclaireurs Solidaires pour accéder à votre espace personnel."
    },
    '/auth': {
        seoTitle: "Tableau de bord - Les Éclaireurs Solidaires"
    },
    '/dashboard': {
        seoTitle: "Tableau de bord - Les Éclaireurs Solidaires"
    },
    '/userProfilSettingsShow': {
        seoTitle: "Paramètres du profil - Les Éclaireurs Solidaires"
    },
    '/editUserProfile': {
        seoTitle: "Paramètres du profil - Les Éclaireurs Solidaires"
    },
    '/messaging': {
        seoTitle: "Messages - Les Éclaireurs Solidaires"
    },
    '/chatMessage': {
        seoTitle: "Répondre à un message - Les Éclaireurs Solidaires"
    },
    '/replyToAMessage': {
        seoTitle: "Répondre à un message - Les Éclaireurs Solidaires"
    },
    '/newMessage': {
        seoTitle: "Nouveau message - Les Éclaireurs Solidaires"
    },
    '/sendMessageTo': {
        seoTitle: "Nouveau message - Les Éclaireurs Solidaires"
    },
    '/mission': {
        seoTitle: "Missions solidaires - Les Éclaireurs Solidaires"
    },
    '/missionDetails': {
        seoTitle: "Détail d'une mission - Les Éclaireurs Solidaires",
        metaName: "description",
        metaContent: "Consultez toutes les informations d'une mission solidaire : objectifs, besoins et modalités de participation."
    },
    '/searchByCategories': {
        seoTitle: "Recherche par catégories - Les Éclaireurs Solidaires"
    },
    '/missionUpdateView': {
        seoTitle: "Modifier une mission - Les Éclaireurs Solidaires"
    },
    '/updateMission': {
        seoTitle: "Modifier une mission - Les Éclaireurs Solidaires"
    },
    '/addMission': {
        seoTitle: "Créer une mission - Les Éclaireurs Solidaires"
    },
    '/listOfVolunteers': {
        seoTitle: "Liste des bénévoles - Les Éclaireurs Solidaires"
    },
    '/activeVolunteer': {
        seoTitle: "Bénévoles actifs - Les Éclaireurs Solidaires"
    },
    '/findVolunteer': {
        seoTitle: "Rechercher un bénévole - Les Éclaireurs Solidaires"
    },
    '/admin/reminder': {
        seoTitle: "Gestion des rappels - Les Éclaireurs Solidaires"
    },
    '/admin/recallManagement': {
        seoTitle: "Gestion des rappels - Les Éclaireurs Solidaires"
    },
    '/superAdmin/generateToken': {
        seoTitle: "Génération de token - Les Éclaireurs Solidaires"
    },
    '/superAdmin/tokenView': {
        seoTitle: "Génération de token - Les Éclaireurs Solidaires"
    }
};

exports.seoReferences = (req, res, next) => {

    const urlPath = req.url

    let seoConfig = {
        seoTitle: "Les Éclaireurs Solidaire",
        metaName: "robots",
        metaContent: "noindex, nofollow",
    }

    for (const path in seoMap) {

        if (urlPath.includes(path)) {

            const dataMap = seoMap[path];
            seoConfig.seoTitle = dataMap.seoTitle;

            if (dataMap.metaName) {

                seoConfig.metaName = dataMap.metaName;
                seoConfig.metaContent = dataMap.metaContent;
            }

            break;
        }
    }

    res.locals.seoTitle = seoConfig.seoTitle;
    res.locals.metaName = seoConfig.metaName;
    res.locals.metaContent = seoConfig.metaContent;

    next();
}
