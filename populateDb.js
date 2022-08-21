require("dotenv").config();
const Blog = require("./models/blog");
const User = require("./models/user");

// load data
let data = require("./data.json");

// Change date string to date object
for (i = 0; i < data.length; i++) {
  var x = new Date(data[i].date);
  data[i].date = x;
}

// Connect to database
var mongoose = require("mongoose");
const mongoDB = process.env.MONGODB;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

function createBlog(data) {
  User.find({ username: data.author })
    .then((result, err) => {
      var newBlog = new Blog({
        blogTitle: data.title,
        blogText: data.body,
        tags: data.tags,
        author: result[0],
        timestamp: data.date,
      });

      newBlog.save(function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("New Blog: " + newBlog.blogTitle);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// Remove existing records
Blog.deleteMany().then(() => {
  data.forEach(createBlog);
});
