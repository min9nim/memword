const mongoose = require('mongoose');

// 디비설정 
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    console.log("Connected to mongod server");
});

const dbcon = process.env.NODE_ENV === 'production'
    ?
    process.env.db
    :
    require("../../dbConfig").memword
    ;

console.log("@@ " + dbcon);

try{
    mongoose.connect(dbcon, { useCreateIndex: true, useNewUrlParser: true });
}catch(e){
    console.log("DB 접속 오류")
    console.log(e);
}


module.exports = mongoose;
