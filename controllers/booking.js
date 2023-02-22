/** @format */

const router = require("express").Router();
const BookingModel = require("../models/Booking.js");
const PitchsModel = require("../models/Pitchs.js");
const verifyMiddleware = require("../middleware/verifyMiddleware.js");
const { findInfoPitch } = require("../services/findInfoPitch.js");
const { updateInfoPitch } = require("../services/updateInfoPitchs.js");

router.post("/addone", async (req, res) => {
  try {
    const data = req.body;
    const message = {
      success: "Thêm thanh toán thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    const timeEnd =
      new Date("2023-02-18T" + data?.timeStart).getTime() +
      Number(data?.duration) * 60 * 1000;

    const timeEndConvert = new Date(timeEnd).toTimeString().slice(0, 5);

    if (data?.keyMainPitch) {
      BookingModel.create({ ...data, timeEnd: timeEndConvert })
        .then(() => {
          res.status(200).json({
            success: true,
            message: message.success,
          });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            message: message.fail,
          });
        });
    } else {
      res.status(500).json({
        success: false,
        message: "Không có thông tin sân.",
      });
    }
  } catch (err) {
    if (err) throw err;
  }
});

router.get("/getlist/", async (req, res) => {
  const { page } = req.query;
  const perPage = 8;
  if (page) {
    await BookingModel.find()
      .limit(perPage)
      .skip(perPage * (page - 1))
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "Thành công",
          pagination: {
            currentPage: page,
            length: result.length,
          },
          result: result.map((item) => {
            return {
              key: "" + item._id,
              ...item._doc,
            };
          }),
        });
      })
      .catch(() => {
        res.status(500).json({
          success: false,
          message: "Có lỗi. Vui lòng thử lại",
        });
      });
  }
});

router.get("/getall", async (req, res) => {
  try {
    await BookingModel.find()
      .then((result) => {
        findInfoPitch(result).then((infoPitchs) => {
          res.status(200).json({
            success: true,
            message: "Thành công",
            result: infoPitchs.map((item) => {
              return {
                key: "" + item._id,
                ...item,
              };
            }),
          });
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Có lỗi. Vui lòng thử lại",
        });
      });
  } catch (err) {
    console.log(err);
  }
});

router.get("/getone/", async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      await BookingModel.findById(id)
        .then((result) => {
          res.status(200).json({
            success: true,
            message: "Thành công",
            result: {
              ...result,
              key: result._id,
            },
          });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            message: "Có lỗi. Vui lòng thử lại.",
            errors: err,
          });
        });
    } else {
      res.status(500).json({
        success: false,
        message: "Không có id",
      });
    }
  } catch (err) {
    if (err) throw err;
  }
});

router.put("/updateone/", async (req, res) => {
  try {
    const { id } = req.query;
    const data = req.body;
    const message = {
      success: "Thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };

    if (data?.isBooked) {
      updateInfoPitch(id);
    }
    await BookingModel.findByIdAndUpdate(id, { isBooked: data?.isBooked })
      .then(() => {
        res.status(200).json({
          success: true,
          message: message.success,
        });
      })
      .catch(() => {
        res.status(500).json({
          success: false,
          message: message.fail,
        });
      });
  } catch (err) {
    if (err) throw err;
  }
});

router.delete("/deleteone/", async (req, res) => {
  try {
    const { id } = req.query;
    const message = {
      success: "Xóa thanh toán thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    if (id) {
      await BookingModel.findByIdAndDelete(id)
        .then((result) => {
          res.status(200).json({
            success: true,
            message: message.success,
          });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            message: message.fail,
          });
        });
    } else {
      res.status(500).json({
        success: false,
        message: "Không có id",
      });
    }
  } catch (err) {
    if (err) throw err;
  }
});

module.exports = router;
