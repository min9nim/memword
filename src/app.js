

const app = {
    view: {}        // 리액트 컴포넌트
}

if (process.env.NODE_ENV === "production") {
    if(process.env.isHeroku === "true"){
        app.BACKEND = "https://memword.herokuapp.com"
    }else{
        app.BACKEND = "//word-trans.appspot.com"
    }
}else{
    app.BACKEND = "//localhost:3000"
}



global.app = app;
export default app;