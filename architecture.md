.
├── README.md
├── architecture.txt
├── docker-compose.yml
├── package-lock.json
├── package.json
└── site
    ├── index.js
    └── src
        ├── config
        │   ├── database.js
        │   └── manageRecall.json
        ├── controllers
        │   ├── home.ctrl.js
        │   ├── messaging.ctrl.js
        │   ├── mission
        │   │   ├── missionAdminController.js
        │   │   ├── missionGeneralController.js
        │   │   └── missionVolunteerController.js
        │   └── user
        │       ├── userAdminController.js
        │       ├── userGeneralController.js
        │       └── userVolunteerController.js
        ├── cron
        │   ├── logCron.txt
        │   └── recall.cron.js
        ├── logs
        │   └── error.log
        ├── middleware
        │   ├── globalVars.middleware.js
        │   ├── helmet.js
        │   ├── inputProtection.middleware.js
        │   ├── messagingProtection.middleware.js
        │   ├── seo.middleware.js
        │   ├── session.middleware.js
        │   ├── sideNav.middleware.js
        │   └── url.middleware.js
        ├── models
        │   ├── HomeModel.js
        │   ├── MessageModel.js
        │   ├── MissionModel.js
        │   └── UserModel.js
        ├── public
        │   ├── javaScript
        │   │   ├── addOpinion.js
        │   │   ├── alert.js
        │   │   ├── becomeVolunteer.js
        │   │   ├── carrouselDashboard.js
        │   │   ├── formHome.js
        │   │   ├── homePage.js
        │   │   ├── inputCityAuto.js
        │   │   ├── login.js
        │   │   ├── loginDisplay.js
        │   │   ├── menuBurger.js
        │   │   ├── minWidthRequired.js
        │   │   ├── registerMission.js
        │   │   ├── style.js
        │   │   └── unsubscribe.js
        │   ├── pictures
        │   │   ├── Reviews
        │   │   │   └── benevole.png
        │   │   ├── backGroundCards
        │   │   │   ├── Group47.png
        │   │   │   ├── Group48.png
        │   │   │   └── heroSection.jpg
        │   │   ├── globalIcons
        │   │   │   ├── OpenEye.png
        │   │   │   ├── arrow.png
        │   │   │   ├── bavarder.png
        │   │   │   ├── bouton.png
        │   │   │   ├── cercle.png
        │   │   │   ├── closeEye.png
        │   │   │   ├── editer.png
        │   │   │   ├── envoyer(1).png
        │   │   │   ├── envoyer.png
        │   │   │   ├── grey.png
        │   │   │   ├── login.png
        │   │   │   ├── message-ouvert.png
        │   │   │   ├── parametres.png
        │   │   │   ├── recycler.png
        │   │   │   ├── reinitialiser.png
        │   │   │   ├── securite-personnelle.png
        │   │   │   └── utilisateur.png
        │   │   ├── homePage
        │   │   │   ├── ClaraD.png
        │   │   │   ├── JulienM.png
        │   │   │   ├── SamiraB.png
        │   │   │   ├── etoiles.png
        │   │   │   ├── faire-du-benevolat.png
        │   │   │   └── loupe3.png
        │   │   ├── iconHeader-Footer
        │   │   │   ├── crossList.png
        │   │   │   ├── facebook.png
        │   │   │   ├── instagram.png
        │   │   │   ├── logo.png
        │   │   │   ├── menu-de-hamburgers.png
        │   │   │   ├── menuBurger.png
        │   │   │   └── twitter.png
        │   │   ├── logoV2
        │   │   │   ├── Group44.png
        │   │   │   ├── LOGO.png
        │   │   │   ├── LogoT.png
        │   │   │   ├── LogoV3.png
        │   │   │   ├── TXT.png
        │   │   │   ├── ampoule.png
        │   │   │   └── lanterne.png
        │   │   └── mobile_account
        │   │       ├── conversation.png
        │   │       ├── mission.png
        │   │       ├── photo.png
        │   │       ├── se-deconnecter.png
        │   │       ├── tableau-de-bord(1).png
        │   │       └── tableau-de-bord.png
        │   └── style
        │       ├── account
        │       │   ├── chat.css
        │       │   ├── messaging.css
        │       │   ├── messagingMobile.css
        │       │   ├── missionDetails.css
        │       │   ├── navBar.css
        │       │   ├── newMessage.css
        │       │   ├── newMessageVolunteer.css
        │       │   ├── reminder.css
        │       │   ├── styleAddMission.css
        │       │   ├── styleDashboardAdmin.css
        │       │   ├── styleDashboardUser.css
        │       │   ├── styleGenerateToken.css
        │       │   ├── styleListMission.css
        │       │   ├── styleListOfVolunteers.css
        │       │   ├── styleSideNav.css
        │       │   └── user-profile-settings.css
        │       ├── connection
        │       │   ├── styleLogin.css
        │       │   └── styleRegister.css
        │       ├── globalStyle.css
        │       ├── home
        │       │   ├── 404.css
        │       │   ├── detailMission.css
        │       │   ├── footer.css
        │       │   ├── general.css
        │       │   ├── header.css
        │       │   ├── styleBecomeVolunteer.css
        │       │   └── styleV3.css
        │       ├── legalStyle.css
        │       └── modal
        │           ├── alert.css
        │           ├── subscribe.css
        │           ├── unsubscribe.css
        │           └── userOpinion.css
        ├── routes
        │   ├── admin.route.js
        │   ├── general.route.js
        │   └── volunteer.route.js
        ├── services
        │   ├── recallService.js
        │   └── services.js
        ├── utils
        │   ├── logger.js
        │   └── utils.js
        └── views
            ├── account
            │   ├── admin
            │   │   ├── addMission.ejs
            │   │   ├── dashboardAdmin.ejs
            │   │   ├── generateToken.ejs
            │   │   ├── listMissionsAdmin.ejs
            │   │   ├── listOfVolunteers.ejs
            │   │   ├── missionDetails.ejs
            │   │   ├── reminder.ejs
            │   │   └── updateMission.ejs
            │   └── volunteer
            │       ├── dashboardUser.ejs
            │       ├── detailsOfNextMission.ejs
            │       ├── listMissionUser.ejs
            │       ├── missionDetails.ejs
            │       └── userProfileSettings.ejs
            ├── connection
            │   ├── signIn.ejs
            │   ├── signUp.ejs
            │   └── signUpAdmin.ejs
            ├── home
            │   ├── 404.ejs
            │   ├── becomeVolunteer.ejs
            │   ├── detailMission.ejs
            │   └── homePage.ejs
            ├── legals
            │   ├── legalNotice.ejs
            │   ├── privacyPolicy.ejs
            │   ├── siteMap.ejs
            │   └── termsAndConditions.ejs
            ├── messaging
            │   ├── chat.ejs
            │   ├── messaging.ejs
            │   ├── newMessage.ejs
            │   ├── volunteerChat.ejs
            │   ├── volunteerMessaging.ejs
            │   └── volunteerNewMessage.ejs
            ├── modals
            │   ├── subscribe.ejs
            │   └── unsubscribe.ejs
            └── partials
                ├── _alert.ejs
                ├── _footer.ejs
                ├── _head.ejs
                ├── _header.ejs
                ├── _mobileFooter.ejs
                ├── _mobileHeader.ejs
                ├── _sideNavAdmin.ejs
                └── _sideNavUser.ejs