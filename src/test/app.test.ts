import { server } from '../app';
import nock from 'nock';
import { expect } from 'chai';
// import sinon from 'sinon';
import { LoginService } from '../users/services/login.service';
import { createUserInput } from '../users/types/create.user.input.type';
// import supertest from 'supertest';

// import { Response } from '../common/types/response.types';

// import loginDao from '../users/dao/login.dao';

// import otpServices from '../common/services/otp.services';

// import {MailService} from '../common/services/mailer.services';
import { OtpObject } from '../common/types/otpObject.types';

describe('Login Services', async () => {
    // let request: supertest.SuperAgentTest;
    beforeEach(() => {
        nock('http://localhost:2001')
            .post('/checkUser', { EMAILID: 'notfound@gmail.com' })
            .reply(404, { code: 404, status: false, data: {message: "No such user found"} });
    })
    before(function() {
        const userFound = nock('http://localhost:2001')
            .post('/checkUser', { EMAILID: 'amey2p@gmail.com' })
            .reply(200, { code: 200, status: true, data: {message: "User found"} });
        const userNotFound = nock('http://localhost:2001')
            .post('/checkUser', { EMAILID: 'notfound@gmail.com' })
            .reply(200, { code: 404, status: false, data: {message: "No such user found"} });
        userFound.persist();
        userNotFound.persist();
    });
    after(function(done) {
        server.close(done);
    })

    describe('Login services', () => {
        const loginService = new LoginService();
        
        it('checkWhetherUserExists should return true if user exists', async () => {
            const response = await loginService.checkWhetherUserExists('amey2p@gmail.com');
            const response2 = await loginService.checkWhetherUserExists('notfound@gmail.com');
            expect(response).to.deep.equal(true);
            expect(response2).to.deep.equal(false);
        });
    
        it('createAuthPill should return proper Authpill, username hash object', async () => {
            const authPillData = await loginService.createAuthPill('amey2p@gmail.com', 'Pass@123');
            console.log("authPillData", authPillData);
            expect(authPillData).to.have.keys(['AUTHPILL', 'USERNAMEHASH']);
            expect(authPillData).to.have.ownProperty('USERNAMEHASH').to.deep.equal('5ab8f3fe30fcad9139f2e202ffaacd1c866e3353a24140e7f8150553bd5d4360');
            expect(authPillData).to.have.ownProperty('AUTHPILL').to.have.lengthOf(140);
            expect(authPillData).to.have.ownProperty('AUTHPILL').to.have.string('59b39cb75c5af313aad05b2979f782d5a7d226d8d1b11fdebe85082223d99dc2f91e15dbec69fc40f81f0876e7009648U2FsdGVkX1');
        });
    
        it('createUserData should return a Authpill, username hash object and userdetails', async () => {
            const createUserInput: createUserInput = {TITLE: 'Mr', EMAILID: 'amey2p@gmail.com', FIRSTNAME: 'Ameya', LASTNAME: 'Patil', GENDER: 'M', DOB: '15-12-12', PASSWORD: 'Pass@123'};
            const userDataAndAuthPillAndUsernamehash = await loginService.createUserData(createUserInput);
            expect(userDataAndAuthPillAndUsernamehash).to.have.keys(['USER', 'AUTH']);
            expect(userDataAndAuthPillAndUsernamehash).to.have.ownProperty('USER').to.deep.equal({TITLE: 'Mr', EMAILID: 'amey2p@gmail.com', FIRSTNAME: 'Ameya', LASTNAME: 'Patil', GENDER: 'M', DOB: '15-12-12'});
            expect(userDataAndAuthPillAndUsernamehash).to.have.ownProperty('AUTH').to.have.keys(['AUTHPILL', 'USERNAMEHASH']);
            expect(userDataAndAuthPillAndUsernamehash).to.have.ownProperty('AUTH').to.have.ownProperty('USERNAMEHASH').to.deep.equal('5ab8f3fe30fcad9139f2e202ffaacd1c866e3353a24140e7f8150553bd5d4360');
            expect(userDataAndAuthPillAndUsernamehash).to.have.ownProperty('AUTH').to.have.ownProperty('AUTHPILL').to.have.lengthOf(140).that.have.string('59b39cb75c5af313aad05b2979f782d5a7d226d8d1b11fdebe85082223d99dc2f91e15dbec69fc40f81f0876e7009648U2FsdGVkX1');
        });
    
        it('should return OTP and hash  object', async () => {
            const otpObject: OtpObject = await loginService.getOtpObject("amey2p@gmailcom");
            // console.log("otpObject", otpObject);
            expect(otpObject).to.have.keys(['otp', 'fullHash']);
            expect(otpObject).to.have.ownProperty('otp').that.have.lengthOf(6);
            expect(otpObject).to.have.ownProperty('fullHash').that.have.lengthOf(78);
        });
    
        it('should verify whether OTP is valid', async () => {
            const otpObject: OtpObject = await loginService.getOtpObject("amey2p@gmailcom");
            const checkWhetherOtpIsValid = await loginService.checkWhetherOtpIsValid("amey2p@gmailcom", otpObject.fullHash, otpObject.otp);
            expect(checkWhetherOtpIsValid).to.deep.equal(true);
        })
    
        it('should return false after time out', async () => {
            process.env.OTPVALIDATIONTIME = "0.25";
            const otpObject: OtpObject = await loginService.getOtpObject("amey2p@gmailcom");
            let checkWhetherOtpIsValid = true;
            const setTimeoutPromise = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));
            await setTimeoutPromise(20);
            checkWhetherOtpIsValid = await loginService.checkWhetherOtpIsValid("amey2p@gmailcom", otpObject.fullHash, otpObject.otp);
            expect(checkWhetherOtpIsValid).to.deep.equal(false);
        });
    
        it('should return encryption data', async () => {
            const encryptionData = await loginService.createUserAuth("amey2p@gmail.com", "Pass@123");
            expect(encryptionData).to.deep.equal({
                customSalt: 'f91e15dbec69fc40f81f0876e7009648',
                key: '5a334332e5893683d851e3a24dc355dfab667b877481fa4cfbcffd258cbc06f4',
                usernameHash: '5ab8f3fe30fcad9139f2e202ffaacd1c866e3353a24140e7f8150553bd5d4360',
                userAuth: '59b39cb75c5af313aad05b2979f782d5a7d226d8d1b11fdebe85082223d99dc2'
              })
        })
    })
})


