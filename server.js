/** @format */

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

  server.use(express.json({ limit: "100mb" }));

  server.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  server.use(cors({ origin: true }));
  server.use(express.urlencoded({ extended: true }));

  server.use(compression());

  server.use("/static", express.static(path.join(__dirname, "public")));

  server.use(cookieParser({ limit: "100mb" }));
  server.use(bodyParser.json({ limit: "100mb" }));
  server.use(
    bodyParser.urlencoded({
      limit: "100mb",
      parameterLimit: 10000000,
      extended: true,
    })
  );
  server.use(bodyParser.raw());

  connectDB(process.env.DATABASE_URL);

  // Route api
  server.use("/v1/auth", require("./controllers/auth.js")),
    server.use("/v2/auth", require("./controllers/admin.js")),
    server.use("/api/users", require("./controllers/user.js")),
    server.use("/api/employees", require("./controllers/employee.js")),
    server.use("/api/owners", require("./controllers/owner.js")),
    server.use("/api/blogs", require("./controllers/blog.js")),
    server.use("/api/pitchs", require("./controllers/pitch.js")),
    server.use("/api/cities", require("./controllers/city.js")),
    server.use("/api/districts", require("./controllers/district.js")),
    server.use("/api/wards", require("./controllers/ward.js")),
    server.use("/api/saleOff", require("./controllers/saleOff.js")),
    server.use("/api/booking", require("./controllers/booking.js"));

  server.use("/", (req, res) => {
    res.status(200).json("Server");
  });
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Example app listening on port ${port}`);
  });
} catch (err) {
  res.status(500).json({
    errors: err,
    success: false,
  });
}
