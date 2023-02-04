const router = require("express").Router();
const BlogsModel = require("../models/Blogs.js");
const verifyMiddleware = require("../middleware/verifyMiddleware.js");
const {
  createNewService,
  getListService,
  getOneService,
  updateOneService,
  deleteOneService,
} = require("../services/CRUDService.js");

router.post("/addone", async (req, res) => {
  try {
    const data = req.body;
    const message = {
      success: "Thêm tin tức thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    await BlogsModel.create(data)
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

router.get("/getlist", async (req, res) => {
  await BlogsModel.find()
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Thành công",
        result,
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
      await BlogsModel.findById(id)
        .then((result) => {
          res.status(200).json({
            success: true,
            message: "Thành công",
            result,
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

router.put("/updateone/", verifyMiddleware.verifyEmployee, async (req, res) => {
  try {
    const { id } = req.query;
    const data = req.body.data;
    const message = {
      success: "Sửa tin tức thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    await BlogsModel.findByIdAndUpdate(id, data)
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

router.delete(
  "/deleteone/",
  verifyMiddleware.verifyEmployee,
  async (req, res) => {
    try {
      const { id } = req.query;
      const message = {
        success: "Xóa tin tức thành công.",
        fail: "Thất bại. Vui lòng thử lại",
      };
      if (id) {
        await BlogsModel.findByIdAndDelete(id)
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
  }
);

module.exports = router;
