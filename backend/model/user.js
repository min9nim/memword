const mongoose = require("./dbConnect");

const Schema = mongoose.Schema;
const userSchema = new Schema({
    id: {type: String, unique: true, required: true},
    authProvider:  String,
    tokenID: String,
    email: String,
    name: String,
    image: String,
    createdAt: Number,
    lastVisitedAt: Number
});

module.exports = mongoose.model('User', userSchema, "users");
