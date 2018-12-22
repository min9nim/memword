const mongoose = require("./dbConnect");

const Schema = mongoose.Schema;
const wordSchema = new Schema({
    id: {type: String, unique: true, required: true},
    word: String,
    userId: String,
    userName: String,
    createdAt: Number,
    updatedAt: Number,
    hit: Number,
});


module.exports = mongoose.model('Word', wordSchema, "words");
