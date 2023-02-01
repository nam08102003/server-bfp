const mongoose = require("mongoose");

const Pitchs = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: null,
    },
    listPitchs: {
      type: Array,
      default: [],
    },
    idOwner: {
      type: String,
    },
    codeCity: {
      type: String,
    },
    codeDistrict: {
      type: String,
    },
    codeWard: {
      type: String,
    },
    isSaleOff: {
      type: Boolean,
      default: false,
    },
    services: {
      type: Array,
      default: [],
    },
    vote: {
      type: String,
      default: 0,
    },
    facebook: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    image: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const PitchsModel = mongoose.model("Pitchs", Pitchs);

module.exports = PitchsModel;
