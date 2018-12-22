// const express = require("express");
const { OAuth2Client } = require('google-auth-library');
const User = require('../model/user');
const {isExpired} = require('./com');
const shortid = require("shortid");

const CLIENT_ID = "262093891154-hf96vasi6kntg3fd0ppie509knmhsagi.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const auth = async (req, res, next) => {
    try {
        // console.log("@@ auth 미들웨어 시작")
        //console.log("req.originalUrl = " + req.originalUrl);
        //console.log("req.path = " + req.path);
        const token = req.headers['x-access-token'];
        // console.log("@@11 token = " + token);
        if (token === "undefined") {
            throw Error("Request has no token");
        }

        // console.log("@@22 token = " + token)

        let payload;
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,
            });
            payload = ticket.getPayload();
        } catch (e) {
            if (e.message.indexOf("Token used too late") >= 0) {
                let start = e.message.indexOf("{");
                let payloadstr = e.message.slice(start);
                payload = JSON.parse(payloadstr);
                if(isExpired(payload.exp * 1000)){
                    throw new Error("access token is expired over 1 month");
                }else{
                    console.log("access token is expired but not over month")
                }
            } else {
                throw e;
            }
        }

        //console.log(JSON.stringify(payload, null, 2))

        const { iss, sub, email, given_name, picture, exp } = payload;

        let user = await User.findOne({ tokenID: sub });

        if (user) {
            // 기존 회원인경우
            user.lastVisitedAt = Date.now();
            let output = await user.save()

            let { id, email, name, image } = output;
            req.user = { id, email, name, image, exp };

        } else {
            // 신규 회원인 경우
            let user = new User();
            Object.assign(user, {
                id: shortid.generate(),
                authProvider: iss,
                tokenID: sub,
                email: email,
                name: given_name,
                image: picture,
                createdAt: Date.now(),
                lastVisitedAt: Date.now()
            });

            let output = await user.save();
            let { id, name, image } = output;
            req.user = { id, "email": email, name, image, exp };
        }

        req.isLogin = true;
        console.log(req.method + " " + req.originalUrl + " : 토큰검증 성공");
        //console.log("req.originalUrl = " + req.originalUrl);

    } catch (e) {
        // console.log(e);
        console.log(req.method + " " + req.originalUrl + " : 토큰검증 실패 : " + e.message);
        req.isLogin = false;
    }

    next();
}

module.exports = auth