const mongoose = require("mongoose");

const Wards = new mongoose.Schema({
  codeWard: {
    type: String,
  },
  title: {
    type: String,
  },
  codeDistrict: {
    type: String,
  },
});

const WardsModel = mongoose.model("Wards", Wards);

module.exports = WardsModel;
