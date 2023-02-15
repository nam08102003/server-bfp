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
  server.use(cors({ origin: true }));
  server.use(express.urlencoded({ extended: true }));

  server.use(compression());

  server.use("/static", express.static(path.join(__dirname, "public")));

  server.use(cookieParser({ limit: "100mb" }));
  server.use(bodyParser.json({ limit: "100mb" }));
  server.use(
    bodyParser.urlencoded({
      limit: "100mb",
      extended: true,
    })
  );
  server.use(bodyParser.raw());

  connectDB(process.env.DATABASE_URL);

  // Route api
  server.use("/v1/auth", require("./routes/auth.js")),
    server.use("/v2/auth", require("./routes/admin.js")),
    server.use("/api/users", require("./routes/user.js")),
    server.use("/api/employees", require("./routes/employee.js")),
    server.use("/api/owners", require("./routes/owner.js")),
    server.use("/api/blogs", require("./routes/blog.js")),
    server.use("/api/pitchs", require("./routes/pitch.js")),
    server.use("/api/cities", require("./routes/city.js")),
    server.use("/api/districts", require("./routes/district.js")),
    server.use("/api/wards", require("./routes/ward.js")),
    server.use("/api/saleOff", require("./routes/saleOff.js")),
    server.use("/api/booking", require("./routes/booking.js"));

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
