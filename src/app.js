import getAuth from './auth'
import base64js from 'base64-js'
import { isExpired } from '../src/com/pure'
import createLogger from 'if-logger'
import moment from 'moment'
import cookie from 'cookie'

const app = {
  user: {},
  state: {
    menu: [
      {
        label: '내가 찾아본 단어',
        path: '/',
      },
    ],
    menuIdx: 0,
  },
  view: {}, // 리액트 컴포넌트
}

if (process.env.API === 'local') {
  app.BACKEND = 'http://localhost:3030'
} else {
  app.BACKEND = 'https://memword-api.now.sh'
}

app.auth = getAuth(app)

app.isDesktop = function() {
  const os = ['win16', 'win32', 'win64', 'mac', 'macintel']
  return (
    global.navigator && os.includes(global.navigator.platform.toLowerCase())
  )
}

app.isMobileChrome = function() {
  return (
    !app.isDesktop() &&
    global.navigator &&
    global.navigator.userAgent.includes('Chrome')
  )
}

app.Base64Encode = (str, encoding = 'utf-8') => {
  var bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str)
  return base64js.fromByteArray(bytes)
}

app.Base64Decode = (str, encoding = 'utf-8') => {
  var bytes = base64js.toByteArray(str)
  return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes)
}

app.getUser = req => {
  try {
    let userStr
    if (req) {
      const cookies = cookie.parse(req.headers.cookie)
      userStr = Buffer.from(cookies.user || '', 'base64').toString('utf8')
    } else {
      userStr = global.sessionStorage.getItem('user')
    }

    if (userStr) {
      let user = JSON.parse(userStr)
      if (isExpired(user.exp * 1000)) {
        app.logger.verbose('[getInitialProps] 로그인 실패 : Token is expired')
        return {}
      } else {
        app.logger.verbose('[getInitialProps] 로그인 성공')
        return user
      }
    } else {
      app.logger.verbose('[getInitialProps] 로그인 실패 : user 정보 없음')
      return {}
    }
  } catch (e) {
    app.logger.error(e)
    return {}
  }
}

app.logger = createLogger({
  tags: [
    () =>
      moment()
        .utc()
        .add(9, 'hours')
        .format('MM/DD HH:mm:ss'),
  ],
})

global.app = app
export default app
