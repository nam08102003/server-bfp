try {
  const express = require("express");
  const compression = require("compression");
  const server = express();
  const path = require("path");
  var cors = require("cors");
  const bodyParser = require("body-parser");
  const cookieParser = require("cookie-parser");
  const connectDB = require("./services/connectDB.js");

  require("dotenv").config();
  const port = process.env.PORT || 3000;

  server.use(express.json());
  server.use(cors({ origin: true }));
  server.use(express.urlencoded({ extended: true }));

  server.use(compression());

  server.use("/static", express.static(path.join(__dirname, "public")));

  server.use(cookieParser());
  server.use(bodyParser.json());
  server.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  server.use(bodyParser.raw());

  connectDB(process.env.DATABASE_URL);

  // Route api
  server.use("/v1/auth", require("./api/auth.js")),
    server.use("/v2/auth", require("./api/admin.js")),
    server.use("/api/users", require("./api/user.js")),
    server.use("/api/blogs", require("./api/blog.js")),
    server.use("/api/pitchs", require("./api/pitch.js")),
    server.use("/api/cities", require("./api/city.js")),
    server.use("/api/districts", require("./api/district.js")),
    server.use("/api/wards", require("./api/ward.js")),
    server.use("/api/saleOff", require("./api/saleOff.js")),
    server.use("/api/booking", require("./api/booking.js"));

  server.use("/", (req, res) => {
    res.status(200).json("Server");
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Example app listening on port ${port}`);
  });
} catch (err) {
  console.log(err);
}
