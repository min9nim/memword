const express = require('express')
const next = require('next')
const bodyParser = require('body-parser');
const apiRouter = require("./backend/api-router")

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare()
.then(() => {
  const server = express()

  // 미들웨어 등록
  server.use(bodyParser.json());

  // 라우터 등록
  server.use("/api", apiRouter);

  // 넥스트 라우터
  server.get('*', (req, res) => {
    return handle(req, res)
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