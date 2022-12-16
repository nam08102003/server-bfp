try {
  const express = require("express");
  const server = express();
  const path = require("path");
  const bodyParser = require("body-parser");
  const cookieParser = require("cookie-parser");
  const connectDB = require("./utilsServer/connectDB.js");

  require("dotenv").config();
  const port = process.env.PORT || 3000;

  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));

  server.use(compression());

  server.use("/static", express.static(path.join(__dirname, "public")));

  server.use(bodyParser.json());
  server.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );

  server.use(cookieParser());

  connectDB(process.env.DATABASE_URL);

  // Route api
  server.use("/", (req, res) => {
    res.status(200).json("Server");
  });
  server.use("/v1/auth", require("./api/auth.js")),
    server.use("/api/users", require("./api/user.js")),
    server.use("/api/blogs", require("./api/blog.js")),
    server.use("/api/pitchs", require("./api/pitch.js")),
    server.use("/api/location", require("./api/location.js")),
    server.use("/api/saleOff", require("./api/saleOff.js")),
    server.use("/api/booking", require("./api/booking.js"));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Example app listening on port ${port}`);
  });
} catch (err) {
  if (err) throw err;
}
