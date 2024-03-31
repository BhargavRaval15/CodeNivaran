const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  response: String,
  prompted: String,
});

const Chats = mongoose.model("chats", chatSchema);
module.exports = Chats
