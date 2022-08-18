const dotenv = require("dotenv").config();
const app = require("./app");
const db = require("database");

// const port = process.env.PORT;
// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

db().then(() => {
  const port = process.env.PORT;
  app
    .listen(port, () => {
      console.log(`App running on port ${port}...`);
    })
    .catch((e) => {
      console.log(e);
    });
});
