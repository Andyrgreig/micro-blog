const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
  member: Boolean,
  admin: Boolean,
});

// Compile model from schema
module.exports = mongoose.model("User", UserSchema);
