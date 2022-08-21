const mongoose = require("mongoose");
const date = require("date-and-time");

//Define a schema
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  blogTitle: { type: String, required: true },
  blogText: { type: String, required: true },
  tags: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: Date,
});

// Virtual for date
BlogSchema.virtual("posted").get(function () {
  let posted = date.format(this.timestamp, "DD MMM YYYY").toString();
  return posted;
});

// Virtual for update url
BlogSchema.virtual("updateUrl").get(function () {
  let updateUrl = "/" + this._id + "/update";
  return updateUrl;
});

// Virtual for delete url
BlogSchema.virtual("deleteUrl").get(function () {
  let deleteUrl = "/" + this._id + "/delete";
  return deleteUrl;
});

// Compile model from schema
module.exports = mongoose.model("Blog", BlogSchema);
