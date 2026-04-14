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

jest.mock('../../src/models/MissionModel')

let app;
beforeEach(() => {
    app = express();
    app.use(express.json());
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../../src/views'));
});
afterEach(() => {
    jest.restoreAllMocks();
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

    it('should register a user when they are not already subscribed', async () => {

        missionMdl.getRegistrationByUserId.mockResolvedValue(false);
        missionMdl.registerMissionUser.mockResolvedValue(true);

        const data = {
            idUser: 1,
            missionId: 1
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
        expect(missionMdl.registerMissionUser).toHaveBeenCalledWith(data.missionId, data.idUser);
    });

    it('Must return an error message if subscription is attempted without an active session', async () => {

        missionMdl.getRegistrationByUserId.mockResolvedValue(false);

        app.get('/addRegisterMissionUser', missionVolunteerCtrl.addRegisterMissionUser);

        const response = await request(app)
            .get('/addRegisterMissionUser')
            .query({ idMission: 1, idUser: 1 });


        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/coquin/);
    });

    afterAll(async () => {
        await db.end();
    });
});

describe('Tests for adding a mission to the database', () => {

    it("should return 500 and render the error view if the database insertion fails", async () => {

        app.post('/addMission', missionAdminCtrl.addMission);

        const response = await request(app)
            .post("/addMission")
            .send({ title: "Test" });

        expect(response.statusCode).toBe(500);
    });

    it("must be in the correct format to pass through the middleware", async () => {

        missionMdl.insertMission.mockResolvedValue()
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





