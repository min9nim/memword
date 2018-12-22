// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate');
const R = require("ramda");
const util = require('util')
const fs = require('fs');
const fs_writeFile = util.promisify(fs.writeFile)

const projectId = 'word-trans';

if (process.env.isHeroku === "true" && process.env.NODE_ENV === 'production') {
    console.log("HEROKU: 동적으로 memword-trans.json 파일 생성");
    R.pipe(
        R.pick(["type", "project_id", "private_key_id", "private_key", "client_email", "client_id", "auth_uri", "token_uri", "auth_provider_x509_cert_url", "client_x509_cert_url"]),
        json => JSON.stringify(json, "", 2),
        //tmp => {console.log("@@ asis = " + tmp); return tmp},
        tmp => tmp.replace(/\\\\n/g, "\\n"),
        //tmp => {console.log("@@ tobe = " + tmp); return tmp},
        jsonstr => fs_writeFile('word-trans.json', jsonstr)
    )(process.env)
} else {
    console.log("로컬 word-trans.json 파일 사용 ");
}

process.env.GOOGLE_APPLICATION_CREDENTIALS = __dirname + "/../../word-trans.json";

// Instantiates a client
const translate = new Translate({
    projectId: projectId,
});

const opt = {
    to: "ko",
    model: "nmt" // Possible values are "base" and "nmt"
}

module.exports = function (words) {
    return translate.translate(words, opt)
        .then(results => {
            return results[0];
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}