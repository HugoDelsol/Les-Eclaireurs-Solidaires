const { verifyAccountExist } = require('../../src/controllers/user/userGeneralController');
const bcrypt = require("bcrypt");
const userModel = require("../../src/models/UserModel");
const controller = require('../../src/controllers/user/userGeneralController');
const httpMocks = require('node-mocks-http');
const { auth } = require('../../src/controllers/user/userGeneralController');
const { matchedData } = require('express-validator');
jest.mock("bcrypt");
jest.mock("../../src/models/UserModel");
jest.mock("express-validator");

describe('Tests Authentication', () => {    

     it("Return user when email and password are correct", async () => {
        
        const email = "test@test.com";
        const password = "password123";
        
        const mockUser = {
            email: "test@test.com",
            identifier_password: "hashedPassword",
            id_user: 1
        };
        
        userModel.getOneUserByEmail.mockResolvedValue(mockUser);
        
        bcrypt.compare.mockResolvedValue(true);
        
        const result = await verifyAccountExist(email, password);
        
        expect(result.email).toBe("test@test.com");
        expect(result.role).toBe("user");
        
        expect(userModel.getOneUserByEmail).toHaveBeenCalledWith(email);
        expect(bcrypt.compare).toHaveBeenCalledWith(password, "hashedPassword");        
    });

    it('Must complete the session if the user is valid', async () => {

        const req = httpMocks.createRequest({ session: {} });
        const res = httpMocks.createResponse();

        matchedData.mockReturnValue({ email: 'test@test.com', password: '123' });

        const mockUserFound = {
            role: 'user',
            id_user: 99,
            user_first_name: 'Alice'
        };

        jest.spyOn(controller, "verifyAccountExist").mockResolvedValue(mockUserFound)

        res.render = jest.fn();
        
        await auth(req, res);

        expect(req.session.userExist.id).toBe(99);
        expect(req.session.userExist.firstName).toBe('Alice');
        expect(req.session.userExist.isVolunteer).toBe(true);
    });

    it('Must be incorrect if password error', async () => {

        bcrypt.compare.mockResolvedValue(false);
        const result = await verifyAccountExist("test@test.com", "wrong");
        expect(result).toBeFalsy();
    });

    it('Must be incorrect if the ID is invalid', async () => {

        const testCalledWidth = "test@gmail.com";

        const dataMock = {            
            id_pirate: 100,
            identifier_password: "hash"            
        }

        userModel.getOneUserByEmail.mockResolvedValue(dataMock);
        bcrypt.compare.mockResolvedValue(true);

        const result = await verifyAccountExist(testCalledWidth, "password");

        expect(userModel.getOneUserByEmail).toHaveBeenCalledWith(testCalledWidth);
        expect(result).toBe(false);
    })
});


