const mongoose = require("mongoose");

const PitchDetail = mongoose.Schema(
  {
    typePicth: {
      type: String,
    },
    amountPitch: {
      type: String,
    },
    price: {
      type: String,
    },
    timeStart: {
      type: String,
    },
    timeEnd: {
      type: String,
    },
    dayStart: {
      type: String,
    },
    dayEnd: {
      type: String,
    },
    isBooking: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PicthDetailModel = mongoose.model("PitchDetail", PitchDetail);

module.exports = PicthDetailModel;
