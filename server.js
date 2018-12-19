const express = require('express')
const next = require('next')
const { parse } = require('url')
const bodyParser = require('body-parser');
const apiRouter = require("./backend/api-router")
const auth = require('./backend/com/auth');
const cookieParser = require('cookie-parser')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare().then(() => {
  const server = express();

  // 쿠키파서
  server.use(cookieParser());

  // body 파서
  server.use(bodyParser.json());

  // 인증체크
  server.use("/api", auth);

  // 라우터 등록
  server.use("/api", apiRouter);

  // 넥스트 라우터
  server.use((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/my') {
      app.render(req, res, '/', query)
    } else {
      handle(req, res, parsedUrl)
    }
  })

  const PORT = dev ? 3000 : Number(process.env.PORT)
  const HOST = dev ? "http://localhost" : (
    process.env.isHeroku === "true"
      ?
      "https://memword.herokuapp.com"
      :
      "https://word-trans.appspot.com"
    )

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on ${HOST}:${PORT}`)
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})