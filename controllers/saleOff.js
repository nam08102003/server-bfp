/** @format */

const router = require("express").Router();
const SaleOffModel = require("../models/SaleOff.js");
const verifyMiddleware = require("../middleware/verifyMiddleware.js");

router.post("/addone", async (req, res) => {
  try {
    const data = req.body;
    const message = {
      success: "Thêm khuyến mại thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    await SaleOffModel.create(data)
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

router.get("/getlist/", async (req, res) => {
  const { page } = req.query;
  const perPage = 8;
  if (page) {
    await SaleOffModel.find()
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
  await SaleOffModel.find()
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Thành công",
        result: result.map((item) => {
          return {
            key: "" + item._id,
            ...item_doc,
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
});

router.get("/getone/", async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      await SaleOffModel.findById(id)
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
      success: "Sửa khuyến mại thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    await SaleOffModel.findByIdAndUpdate(id, data)
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
      success: "Xóa khuyến mại thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    if (id) {
      await SaleOffModel.findByIdAndDelete(id)
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
