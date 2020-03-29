const Crawler = require("crawler");

const c = new Crawler({
    maxConnections: 10,
    forceUTF8: true
});

function queue(url) {
    return new Promise(function (resolve, reject) {
        c.queue({
            uri: url,
            //userAgent: "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36",
            userAgent: "Nodejs node-webcrawler",
            /**
             * 아래와 같이 userAgent 를 설정하면 매일경제쪽 긁어올 때 title 을 가져오지 못함
             */
            //userAgent: "Nodejs webcrawler",
            callback: (err, res, $) => resolve({ err, res, $ })
        })
    })
}

const webscrap = (url) => queue(url).then(({ err, res, $ }) => {
    if (err) {
        //console.log(error);
        throw err
    } else {
        let css = `<link type="text/css" rel="stylesheet" href="https://ssl.pstatic.net/dicimg/endic/style/201811141550/css/common_font.css?20181204174058">
		<link type="text/css" rel="stylesheet" href="https://ssl.pstatic.net/dicimg/endic/style/201811141550/css/style_font.css?20181204174058">
		<link type="text/css" rel="stylesheet" href="https://ssl.pstatic.net/dicimg/endic/style/201811141550/css/entry_add.css?20181204174058">
		<link type="text/css" rel="stylesheet" href="https://ssl.pstatic.net/dicimg/endic/style/201811141550/css/style_category.css?20181204174058">
		<link type="text/css" rel="stylesheet" href="https://ssl.pstatic.net/dicimg/endic/style/201811141550/css/comment.css?20181204174058">
		<link rel="stylesheet" type="text/css" href="https://ssl.pstatic.net/dicimg/gnbcommon/style/gnbcommon/css/onenaver_gnb.css?2018120902">`

        let result = $("#content > .word_num").html()
            .replace(/a href="\//g, `a target="_blank" href="https://endic.naver.com/`)
            .replace(/a href="search\.nhn/g, `a target="_blank" href="https://endic.naver.com/search.nhn`)
            .replace(/<img src="(https:\/\/.+\.pstatic\.net)/g, `<img src="/api/proxy?url=$1`)
            
        return css + result;
    }
})

module.exports = webscrap;




