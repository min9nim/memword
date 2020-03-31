import { isExpired } from '../src/com/pure'
import createLogger, { isNode } from 'if-logger'

async function onGApiLoad() {
  const logger = createLogger({ tags: ['app.auth', 'onGApiLoad'] })
  // 구글 로그인 초기화
  await gapi.client.init({
    apiKey: 'word-trans',
    clientId:
      '262093891154-hf96vasi6kntg3fd0ppie509knmhsagi.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
  })
  global.GoogleAuth = global.gapi.auth2.getAuthInstance()
  logger.debug(m => console.log(...m('GoogleAuth initialized')))

  global.GoogleAuth.isSignedIn.listen(() => {
    logger.verbose('isSignedIn listen..')
  })
}

export default function getAuth(app) {
  const logger = createLogger({ tags: ['app.auth'] })
  return {
    // 로그인 관련
    init: () => {
      if (isNode() || global.GoogleAuth || app.router.asPath === '/login') {
        // logger.debug(m => console.log(...m('gapi.load() is not necessary')))
        return
      }
      gapi.load('client', {
        callback: onGApiLoad,
        onerror: logger.error,
        timeout: 10000, // 10 seconds.
        ontimeout() {
          logger.debug(m => console.log(...m('gapi.load timeout')))
        },
      })
    },

    setLogin: (guser, id_token) => {
      app.user = guser // guser : google user info
      app.user.token = id_token
      app.state.userID = guser.id
      let enc = app.Base64Encode(JSON.stringify(app.user))

      // 쿠키 만료일을 한달 후로 지정
      let month = 1000 * 60 * 60 * 24 * 30
      let exp = new Date(app.user.exp * 1000 + month).toUTCString()
      document.cookie = `user=${enc}; expires=${exp}; path=/`

      sessionStorage.setItem('user', JSON.stringify(app.user))
    },

    isLogin: () => {
      if (app.state.userID) {
        if (isExpired(app.user.exp * 1000)) {
          //console.log("### jwt token expired");
          //app.auth.signOut();
          //app.state.userID = "";

          // alert && alert("로그인 세션이 만료되었습니다");
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    },

    signOut: () => {
      // 애플리케이션 로그아웃처리
      document.cookie = 'user='
      global.sessionStorage.setItem('user', '')
      app.user = {
        id: '',
        name: '',
        email: '',
        image: '',
        token: '',
      }
      app.state.userID = ''
      app.view.Index.setState({
        word: '',
        result: '',
        list: [],
      })

      // 구글 로그아웃처리
      //let GoogleAuth = gapi.auth2.getAuthInstance();
      return global.GoogleAuth.signOut().then(() => {
        console.log('GoogleAuth.signOut() 완료 후 콜백')
      })
    },
  }
}
