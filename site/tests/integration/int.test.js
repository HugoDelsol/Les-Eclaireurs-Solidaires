require('dotenv').config();
const db = require('../../src/config/database')
const request = require('supertest');
const express = require('express');
const path = require('path');

const missionAdminCtrl = require('../../src/controllers/mission/missionAdminController');
const inputProtection = require('../../src/middleware/inputProtection.middleware');

const missionMdl = require('../../src/models/MissionModel'); 
jest.mock('../../src/models/MissionModel');


describe('test', () => {

    let app;
    
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, '../../src/views'));
    })

    /* it("doit pas fonctionner data erronées", async () => {
        app.post('/addMission', missionAdminCtrl.addMission);
        const response = await request(app)
            .post("/addMission")
            .send({ title: "Test" });

        expect(response.statusCode).toBe(500);
    }); */

    it("doit etre au bon format ", async () => {
        
        missionMdl.insertMission.mockResolvedValue({})
        jest.spyOn(missionAdminCtrl, 'missionAdminShow').mockImplementation((req, res) => {
            return res.status(200).send("test ok")
        }) 
        
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

        console.log(response.status)

        expect(response.statusCode).toBe(200); // Ou 200 selon ta logique
    });

    afterAll(async () => {
        await db.end();
    });
});






