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

mongoose.connect(dbcon, { useCreateIndex: true, useNewUrlParser: true });


module.exports = mongoose;
