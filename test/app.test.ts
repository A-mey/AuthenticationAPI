import {app, server} from '../app';
import nock from 'nock';
import { expect } from 'chai';
// import sinon from 'sinon';
import loginService from '../users/services/login.service';
import { createUserInput } from '../users/types/create.user.input.type';
// import supertest from 'supertest';

// import { Response } from '../common/types/response.types';

import loginDao from '../users/dao/login.http.service';
import HttpRequestService from '../common/services/http/http.services';

// import otpServices from '../common/services/otp.services';

// import {MailService} from '../common/services/mailer.services';
import { httpMethod } from '../common/types/httpMethods.type';
import { OtpObject } from '../common/types/otpObject.types';

describe('Login Services', async () => {
    // let request: supertest.SuperAgentTest;
    before(function() {
        nock('http://localhost:2001')
            .post('/checkUser', { EMAILID: 'amey2p@gmail.com' })
            .reply(200, { FIRSTNAME: 'Ameya', LASTNAME: 'Patil' });

        // const mockResponse = () => {
        //     const res = {};
        //     res.status = sinon.stub().returns(res);
        //     res.json = sinon.stub().returns(res);
        //     return res;
        // };
    });
    after(function(done) {
        server.close(done);
    })

    // describe('API ENDPOINT', function() {
    //     let request: supertest.SuperAgentTest;
    //     before(function() {
    //         request = supertest.agent(app);
    //     });

    //     it('should return fullhash', async function () {
    //         try {
    //             const res = await request.post('/createOTP').send({
    //                 "EMAILID": "amey2p@gmail.com"
    //             });
    //             expect(res.status).to.equal(200);
    //             expect(res.body.success).to.equal(true);
    //             expect(res.body).not.to.be.empty;
    //             expect(res.body).to.be.an('object');
    //             expect(res.body.data.message).to.equal("OTP sent successfully");
    //         }
    //         catch(e: unknown) {
    //             console.log(await catchError(e));
    //         }
    //     });
    
    //     it('should throw an error', async function () {
    //         try {
    //             const res = await request.post('/createOTP').send({
    //                 "EMAILID": "amey2p@gmailcom"
    //             });
    //             expect(res.status).to.equal(400);
    //             expect(res.body.success).to.equal(false);
    //             expect(res.body).not.to.be.empty;
    //             expect(res.body).to.be.an('Response');
    //             expect(res.body.data.message).to.equal("Invalid type for property /EMAILID");
    //         }
    //         catch(e: unknown) {
    //             console.log(await catchError(e));
    //         }
    //     })

    //     it('should show user already exists while registration', async function () {
    //         try {
    //             const res = await request.post('/registerUser').send({
    //                 "EMAILID": "amey2p@gmail.com",
    //                 "PASSWORD": "pass@1234",
    //                 "FIRSTNAME": "Ameya",
    //                 "LASTNAME": "Patil",
    //                 "FLAG": "REGISTER"

    //             });
    //             expect(res.status).to.equal(409);
    //             expect(res.body.success).to.equal(false);
    //             expect(res.body).not.to.be.empty;
    //             expect(res.body).to.be.an('Response');
    //             expect(res.body.data.message).to.equal("User already exists");
    //         }
    //         catch(e: unknown) {
    //             console.log(await catchError(e));
    //         }
    //     })

    //     it('should login the user', async function () {
    //         try {
    //             const res = await request.post('/registerUser').send({
    //                 "EMAILID": "amey2p@gmail.com",
    //                 "PASSWORD": "pass@1234",
    //                 "FLAG": "LOGIN"

    //             });
    //             expect(res.status).to.equal(200);
    //             expect(res.body.success).to.equal(true);
    //             expect(res.body).not.to.be.empty;
    //             expect(res.body).to.be.an('Response');
    //             expect(res.body.data.message).to.e'qual("Logged in successfully");
    //             expect(res.body.data.data).to.have.keys(['id','EMAILID','FIRSTNAME','LASTNAME'])
    //         }
    //         catch(e: unknown) {
    //             console.log(await catchError(e));
    //         }
    //     })
    // });

    // describe('Unit function', async function() {
    //     it('should return OTP', async function(){
    //         try {
    //             expect(otpServices.createOTP("amey2p@gmailcom")).to.be.an('string').that.have.lengthOf(6);
    //             // expect(otpServices.createOTP("amey2p@gmailcom").length).to.be.an('string');
    //         }
    //         catch(e: unknown) {
    //             console.log(await catchError(e));
    //         }
    //     })
    
    //     // it('should send mail', async function(){
    //     //     try {
    //     //         let mailService = new MailService()
    //     //         expect(mailService.sendMail({"amey2p@gmail.com", "Test mail", "Test")).to.be.an('object');
    //     //         expect(mailService.sendMail("amey2p@gmail.com", "Test mail", "Test")).to.have.keys(['accepted', 'rejected', 'ehlo', 'envelopeTime', 'messageTime', 'messageSize', 'response', 'envelope', 'messageId']);
    //     //         expect(mailService.sendMail("amey2p@gmail.com", "Test mail", "Test")).to.haveOwnProperty('accepted').to.equal(['amey2p@gmail.com']);
    //     //         expect(mailService.sendMail("amey2p@gmail.com", "Test mail", "Test")).to.haveOwnProperty('envelope').to.equal({ from: 'a.may3pp@gmail.com', to: [ 'amey2p@gmailcom' ] });
    //     //         expect(mailService.sendMail("amey2p@gmail.com", "Test mail", "Test")).to.haveOwnProperty('response').to.contain('250 2.0.0 OK');                
    //     //     }
    //     //     catch(e: any) {
    //     //         console.log(e.message);
    //     //     }
    //     // })


    
    
    // })

    describe('Login services', () => {
        it('should return a user by email Id', async () => {
            expect(await loginDao.getUserByEmailId({ EMAILID: 'amey2p@gmail.com' })).to.deep.equal({ FIRSTNAME: 'Ameya', LASTNAME: 'Patil' });
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
            const otpObject: OtpObject = await loginService.createOTP("amey2p@gmailcom");
            console.log("otpObject", otpObject);
            expect(otpObject).to.have.keys(['otp', 'fullHash']);
            expect(otpObject).to.have.ownProperty('otp').that.have.lengthOf(6);
            expect(otpObject).to.have.ownProperty('fullHash').that.have.lengthOf(78);
        });
    
        it('should verify whether OTP is valid', async () => {
            const otpObject: OtpObject = await loginService.createOTP("amey2p@gmailcom");
            const checkWhetherOtpIsValid = await loginService.checkWhetherOtpIsValid("amey2p@gmailcom", otpObject.fullHash, otpObject.otp);
            expect(checkWhetherOtpIsValid).to.deep.equal(true);
        })
    
        it('should return false after time out', async () => {
            process.env.OTPVALIDATIONTIME = "0.25";
            const otpObject: OtpObject = await loginService.createOTP("amey2p@gmailcom");
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

    describe('Schema', () => {
    
        it('should validate the schema', () => {
            
        })
    })
})


