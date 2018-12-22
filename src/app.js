import getAuth from "./auth";
import base64js from "base64-js";
import { isExpired } from "../src/com/pure";


const app = {
    user: {},
    state : {
        menu: [
            {
                label: "내가 찾아본 단어",
                path: "/"
            }
        ],
        menuIdx: 0
    },
    view: {}        // 리액트 컴포넌트
}

console.log("@@ process.env.NODE_ENV = " + process.env.NODE_ENV)

if (process.env.NODE_ENV === "production") {
    if (typeof window !== 'undefined') {
        // client-side
        app.BACKEND = window.location.origin;
    } else {
        // server-side
        if(process.env.isHeroku === "true"){
            app.BACKEND = "https://memword.herokuapp.com"
        }else{
            app.BACKEND = "https://word-trans.appspot.com"
        }
    }
}else{
    app.BACKEND = "http://localhost:3000"
}

app.auth = getAuth(app)




app.isDesktop = function () {
    const os = ["win16", "win32", "win64", "mac", "macintel"];
    return global.navigator && os.includes(global.navigator.platform.toLowerCase());
}

app.isMobileChrome = function () {
    return !app.isDesktop() && global.navigator && global.navigator.userAgent.includes("Chrome");
}

app.Base64Encode = (str, encoding = 'utf-8') => {
    var bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str);
    return base64js.fromByteArray(bytes);
}

app.Base64Decode = (str, encoding = 'utf-8') => {
    var bytes = base64js.toByteArray(str);
    return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes);
}

app.getUser = (req) => {
    try {
        let userStr;
        if (req) {
            userStr = Buffer.from(req.cookies.user || "", 'base64').toString('utf8');
        } else {
            userStr = global.sessionStorage.getItem("user");
        }

        // console.log("userStr = " + userStr);

        if (userStr) {
            let user = JSON.parse(userStr);
            if (isExpired(user.exp * 1000)){
                console.log("[getInitialProps] 로그인 실패 : Token is expired")
                return {};
            } else {
                //console.log("[getInitialProps] 로그인 성공")
                return user;
            }
        } else {
            console.log("[getInitialProps] 로그인 실패 : user 정보 없음");
            return {};
        }
    } catch (e) {
        //console.error(e);
        console.log(e.message)
        return {};
    }
}


global.app = app;
export default app;