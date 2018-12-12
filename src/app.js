

const app = {
    view: {}        // 리액트 컴포넌트
}

if (process.env.NODE_ENV === "production") {
    app.BACKEND = "https://memword.herokuapp.com"
}else{
    app.BACKEND = "http://localhost:3000"
}



global.app = app;
export default app;