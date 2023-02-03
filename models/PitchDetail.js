const mongoose = require("mongoose");

const PitchDetail = mongoose.Schema(
  {
    typePicth: {
      type: String,
    },
    amountPitch: {
      type: String,
    },
    infoPitchs: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const PicthDetailModel = mongoose.model("PitchDetail", PitchDetail);

module.exports = PicthDetailModel;
