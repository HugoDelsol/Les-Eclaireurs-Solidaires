// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Models
const homeMdl = require('../models/HomeModel')

// ==============================
// DISPLAY VIEWS
// ==============================

exports.homePage = async (req, res) => {
    res.render('home/homePage');
}

exports.becomeVolunteer = async (req, res) => {
    res.render('home/becomeVolunteer');
}

// ==============================
// SUBMIT THE FORM ON THE HOME PAGE
// ==============================

exports.submitForm = async (req, res) => {

    try {

        const nameForm = req.body.nameForm;
        const emailForm = req.body.emailForm;
        const txtArea = req.body.txtArea;

        await homeMdl.addMessageForm(nameForm, emailForm, txtArea);

    } catch (error) {
        
        res.render('home/homePage', {
            //////////////////////////////AlertMsg: "Le formulaire n'a pas pus etre soumis"
        })

        //console.log('--->', error);

    }
}