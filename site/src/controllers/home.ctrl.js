// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Models
const homeMdl = require('../models/HomeModel');
const missionMdl = require('../models/MissionModel');

// ==============================
// DISPLAY VIEWS
// ==============================

exports.homePage = async (req, res) => {

    try {

        const sqlLimit = "3";

        const getDisplayHomeMissions = await missionMdl.getAllMission(sqlLimit);

        res.render('home/homePage', {
            displayMission : getDisplayHomeMissions
        });

        

    } catch (error) {

    }
    
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

/* 
"
INSERT INTO mission_image(mission_image_url, _id_mission_category)
VALUES
("https://images.unsplash.com/photo-1758525861568-ddaf9c5f7ee6?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 1),
("https://plus.unsplash.com/premium_photo-1661964298925-b3ea464fc9b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8JUMzJTg5ZHVjYXRpb24lMjAlMjYlMjBUdXRvcmF0fGVufDB8fDB8fHww", 1),
("https://images.unsplash.com/photo-1758685733907-42e9651721f5?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 1),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12131/conversions/sante-pour-tous-9-small.jpg?v=1737022121", 2),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12131/conversions/sante-pour-tous-9-small.jpg?v=1737022121", 2),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/8491/conversions/YnorfN0Xqr7FlXc-small.jpg?v=1737369558", 2),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/59852/conversions/CeGeyaxCt6QoAcV6l0WrhwJswQo1sK-small.jpg?v=1737022288", 3),
("https://plus.unsplash.com/premium_photo-1664811569310-04a7c276df1c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 3),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/83980/conversions/EMM2Cf3yaSc4KVRHdKG5rUbsuhBgae-small.jpg?v=1737022302", 3),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12137/conversions/prevention-et-protection-6-small.jpg?v=1737022139", 4),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/16512/conversions/T3Zcag5cuAbpxOysr6IlESeAEQtWNG-small.jpg?v=1750858530", 4),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/59794/conversions/REC9eUAHMreGo0FdjWC7VViX7D62YJ-small.jpg?v=1737022273", 4),
("https://images.unsplash.com/photo-1463592177119-bab2a00f3ccb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 5),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/59791/conversions/meGVwCCzxmwRfTmvWX3xv4Z23sXwjS-small.jpg?v=1737022262", 5),
("https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 5),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/59833/conversions/IwNqwbLlS145s4cv2OY83Loz3eOfQU-small.jpg?v=1737022134", 6),
("https://images.unsplash.com/photo-1722974180453-305758503804?q=80&w=1101&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 6),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/12132/conversions/iq9zO1xVoKW7lDad6LxvI1qwjlDD0O-small.jpg?v=1746617755", 6),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/56406/conversions/dxuVmMYyWi7kHGXIPKc08qniPbiUny-small.jpg?v=1737022182", 7),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/8499/conversions/ksa0J6PYwh8hODt-small.jpg?v=1737369561", 7),
("https://jeveuxaider.fra1.digitaloceanspaces.com/public/production/101352/conversions/29X3xhVeaRSe1oPMK5uZOUNpQkvHag-small.jpg?v=1747053589", 7),
("", id),
("", id),
("", id),
("", id),
("", id),
("", id),
("", id),
("", id),
("", id),
("", id),


" */
