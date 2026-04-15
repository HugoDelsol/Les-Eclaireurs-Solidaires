const { matchedData } = require("express-validator");

exports.seoReferences = (req, res, next) => {

    const urlPath = req.url

    let seoTitle = "";
    let seoDescription = "";

    console.log(urlPath)

    if (urlPath.includes("/home")) {
        seoTitle = "Accueil - Les Éclaireurs Solidaires";
        seoDescription = "Découvrez Les Éclaireurs Solidaires, une communauté engagée qui agit pour la solidarité et l’entraide au quotidien.";
    }

    if (urlPath.includes("/becomeVolunteer")) {
        seoTitle = "Devenir bénévole - Les Éclaireurs Solidaires";
        seoDescription = "Rejoignez Les Éclaireurs Solidaires et engagez-vous en tant que bénévole pour aider des personnes dans le besoin près de chez vous.";
    }

    if (urlPath.includes("/detailMission")) {
        seoTitle = "Détail d’une mission - Les Éclaireurs Solidaires";
        seoDescription = "Consultez les détails d’une mission solidaire, ses objectifs, ses besoins et les modalités pour y participer.";
    }

    if (urlPath.includes("/privacyPolicy")) {
        seoTitle = "Politique de confidentialité - Les Éclaireurs Solidaires";
        seoDescription = "Consultez la politique de confidentialité des Éclaireurs Solidaires et découvrez comment vos données sont protégées.";
    }

    if (urlPath.includes("/termsAndConditions")) {
        seoTitle = "Conditions générales d’utilisation - Les Éclaireurs Solidaires";
        seoDescription = "Prenez connaissance des conditions d’utilisation du site Les Éclaireurs Solidaires et de vos droits et obligations.";
    }

    if (urlPath.includes("/legalNotice")) {
        seoTitle = "Mentions légales - Les Éclaireurs Solidaires";
        seoDescription = "Retrouvez les informations légales concernant l’éditeur du site, l’hébergement et les responsabilités.";
    }

    if (urlPath.includes("/siteMap")) {
        seoTitle = "Plan du site - Les Éclaireurs Solidaires";
        seoDescription = "Accédez à l’ensemble des pages du site Les Éclaireurs Solidaires grâce au plan du site.";
    }


    res.locals.seoTitle = seoTitle
    res.locals.seoDescription = seoDescription

    next()
}
