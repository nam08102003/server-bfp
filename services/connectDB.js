/** @format */

const mongoose = require("mongoose");

async function connectDB(urlDB) {
  try {
    await mongoose.set("strictQuery", true);
    await mongoose
      .connect(urlDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connect DB success");
      });
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDB;
