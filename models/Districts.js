const mongoose = require("mongoose");

const Districts = new mongoose.Schema({
  codeDistrict: {
    type: String,
  },
  title: {
    type: String,
  },
  codeCity: {
    type: String,
  },
});

const DistrictsModel = mongoose.model("Districts", Districts);

module.exports = DistrictsModel;
