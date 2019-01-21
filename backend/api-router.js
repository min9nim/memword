const express = require('express');
const shortid = require("shortid");

const webscrap = require("./com/webcrawler")
const translate = require("./com/translate")
const Word = require('./model/word');

const { sendErr, timelog } = require("./com/com")
const request = require('request');

const apiRouter = express.Router();
module.exports = apiRouter;



// 단어검색
apiRouter.get("/word/:word", function (req, res) {
    try {
        let url = `https://endic.naver.com/search.nhn?sLn=kr&isOnlyViewEE=N&query=${req.params.word}`
        timelog.start("##");
        webscrap(url).then(result => {
            let diff = timelog.check("@@");
            res.send({ result, resTime : diff })
        });
    } catch (e) {
        sendErr(res)(e)
    }

})


// 문장검색
apiRouter.get("/words/:words", function (req, res) {
    try {
        timelog.start("##");
        translate(req.params.words).then(result => {
            let diff = timelog.check("@@");
            res.send({ result, resTime : diff })
        })
    } catch (e) {
        sendErr(res)(e)
    }
})


// 이미지 프록시
apiRouter.get("/proxy", async (req, res) => {
    try {
        request.get(req.query.url).pipe(res);
    } catch (e) {
        sendErr(res)(e)
    }
})



// 아래 부터는 인증 필요
apiRouter.use(async (req, res, next) => {
    try {
        if (!req.isLogin) {
            throw new Error("@@ Not authorized");
        } else {
            next()
        }
    } catch (e) {
        sendErr(res)(e)
    }
})



// 내가 찾은 단어 목록
apiRouter.get("/list", async function (req, res) {
    try {
        let list;
        if(req.isLogin){
            list = await Word.find({ userId: req.user.id }, { __v: 0, _id: 0 }, { sort: { updatedAt: -1 } });
        }else{
            list = [];
        }
        //console.log("@@ list  = " + list);

        res.set('Content-Type', 'application/json').send({ list })
    } catch (e) {
        sendErr(res)(e)
    }
})






// 찾았던 단어 등록
apiRouter.post("/save", async function (req, res) {
    try {
        let word = await Word.findOne({ word: req.body.word.trim() });

        if (word) {
            Object.assign(word, {
                updatedAt: Date.now(),
                userId: req.user.id,
                userName: req.user.name,
                hit: word.hit + 1
            });
        } else {
            word = new Word();
            Object.assign(word, {
                id: shortid.generate(),
                word: req.body.word.trim(),
                userId: req.user.id,
                userName: req.user.name,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                hit: 1
            });
        }

        let output = await word.save();

        res.set('Content-Type', 'application/json').send({
            status: 'Success',
            message: `word(${output.id}) is saved`,
            output
        })
    } catch (e) {
        sendErr(res)(e)
    }
})


apiRouter.delete("/delete/:id", async function (req, res) {
    try {
        let word = await Word.findOne({ id: req.params.id });

        if (word) {
            if (word.userId !== req.user.id) {
                throw Error("Not authorized");
            }

            let output = await word.remove();

            res.set('Content-Type', 'application/json').send({
                status: 'Success',
                message: `word(${output.id}) is removed`,
                output
            })

        } else {
            res.set('Content-Type', 'application/json').send({
                status: 'Fail',
                message: `${req.params.id} is not found`,
                output
            })
        }
        let output = await word.save();
    } catch (e) {
        sendErr(res)(e)
    }
})


apiRouter.post("/login", async function (req, res) {
    //console.log("req.body.token = " + req.body.token);
    try {
        res.set('Content-Type', 'application/json').send({
            status: "Success",
            user: req.user
        })

    } catch (e) {
        sendErr(res)(e)
    }
})