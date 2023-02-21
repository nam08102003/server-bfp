/** @format */

const mongoose = require("mongoose");

const Booking = new mongoose.Schema(
  {
    keyMainPitch: {
      type: String,
    },
    idParentPitch: {
      type: String,
    },
    idChildPitch: {
      type: String,
    },
    timeStart: {
      type: String,
    },
    timeEnd: {
      type: String,
    },
    duration: {
      type: String,
    },
    day: {
      type: String,
    },
    infoUser: {
      type: Object,
    },
    isPaypal: {
      type: Boolean,
      default: false,
    },
    infoPaypal: {
      type: Object,
    },
    price: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model("Booking", Booking);

module.exports = BookingModel;
