const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: String,
  timestamp: Date,
});

// Compile model from schema
module.exports = mongoose.model("Blog", BlogSchema);
