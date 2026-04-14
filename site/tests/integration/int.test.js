/* 
3. La philosophie du Testeur (Le conseil du Prof)

En réalité, si tu testes ton Contrôleur, tu ne devrais pas tester la "vraie" valeur du Modèle. Pourquoi ?

    Si ta fonction getRegistrationByUserId a un bug, ton test de contrôleur va échouer alors que le code du contrôleur est peut-être parfait.

    La règle : On teste une seule chose à la fois.

        Test du Modèle : Tu crées un fichier missionModel.test.js sans aucun mock, qui tape dans une DB de test pour vérifier tes requêtes SQL.

        Test du Contrôleur : Tu mockes le modèle. Tu ne testes pas "si la DB renvoie vrai", tu testes "comment mon contrôleur réagit SI la DB renvoie vrai".

Pourquoi ton code actuel "bloque" ?

Parce que ton contrôleur est un chef d'orchestre. Si tu lui donnes des musiciens muets (des fonctions mockées qui renvoient undefined), il ne peut pas jouer la symphonie.

Ce que tu dois faire pour avancer :
Au lieu de vouloir le "vrai" code, force ton mock à renvoyer une "vraie" donnée de test.

    Exemple : Si ta vraie fonction renvoie un tableau d'objets, écris :
    missionMdl.getMissions.mockResolvedValue([{ id: 1, title: 'Mission Test' }]); */

require('dotenv').config();
const db = require('../../src/config/database')
const request = require('supertest');
const express = require('express');
const path = require('path');

const missionVolunteerCtrl = require('../../src/controllers/mission/missionVolunteerController')

const missionAdminCtrl = require('../../src/controllers/mission/missionAdminController');
const inputProtection = require('../../src/middleware/inputProtection.middleware');

const sessionMdw = require('../../src/middleware/session.middleware')
const missionMdl = require('../../src/models/MissionModel');
jest.mock('../../src/models/MissionModel');

let app;
beforeEach(() => {
    app = express();
    app.use(express.json());
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../../src/views'));
});

describe('Tests for subscribe a mission', () => {

    it('must fail if user is not autentified', async () => {

        app.get('/modalRegisterMission', sessionMdw.requireAuth, (req, res) => {
            res.status(200).send('Success');
        });
        const response = await request(app).get('/modalRegisterMission');
        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/signIn');
    });

    it('must subscribe a mission in add in db', async () => {

        const data = {
            idUser: 62,
            missionId: 132
        }

        app.use((req, res, next) => {
            req.session = {
                userExist: { id: data.idUser }
            }
            next();
        })

        app.get('/addRegisterMissionUser', missionVolunteerCtrl.addRegisterMissionUser);

        const response = await request(app)
            .get('/addRegisterMissionUser')
            .query({ idMission: data.missionId, idUser: data.idUser });

        expect(response.status).toBe(200);
        //expect(missionMdl.getRegistrationByUserId).toBe(false)
        //expect(missionMdl.registerMissionUser).toHaveBeenCalledTimes(data.idUser, data.idMission)
    })

    afterAll(async () => {
        await db.end();
    });
});

describe('Tests for adding a mission to the database', () => {

    it("should fail with invalid data", async () => {

        app.post('/addMission', missionAdminCtrl.addMission);

        const response = await request(app)
            .post("/addMission")
            .send({ title: "Test" });

        expect(response.statusCode).toBe(500);
    });

    it("must be in the correct format to pass through the middleware", async () => {

        missionMdl.insertMission.mockResolvedValue({})
        jest.spyOn(missionAdminCtrl, 'missionAdminShow').mockImplementation((req, res) => {
            return res.status(200).send("test ok")
        });

        app.post('/addMission',
            inputProtection.manageMissionInputProtection,
            missionAdminCtrl.addMission
        );
        const response = await request(app)
            .post("/addMission")
            .send({
                title: "Test",
                category: 1,
                description: "Description Test",
                date: "2028-12-10",
                startTime: "10:00",
                endTime: "18:00",
                city: "Test",
                cityId: 1,
                placeName: "Description Test",
                spaceAvailable: 1,
                uploadImg: "uploadImagetest"
            });

        expect(response.statusCode).toBe(200);
    });

    afterAll(async () => {
        await db.end();
    });
});








