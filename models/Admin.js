const mongoose = require("mongoose");

const Admin = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: true,
    },
    roleId: {
      type: Number,
      default: 0,
    },
    accessToken: {
      type: String,
      default: "",
    },
    refeshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const AdminModel = mongoose.model("Admins", Admin);

module.exports = AdminModel;
