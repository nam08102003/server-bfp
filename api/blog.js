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
    const message = {
      success: "Thêm tin tức thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    const result = createNewService(BlogsModel, req.body);
    if (result) {
      res.status(200).json({
        success: true,
        message: message.success,
      });
    } else {
      res.status(500).json({
        success: false,
        message: message.fail,
      });
    }
  } catch (err) {
    if (err) throw err;
  }
});

router.get("/getlist", async (req, res) => {
  await getListService(BlogsModel)
    .then((result) => {
      res.setHeader("success", true);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json("Có lỗi. Vui lòng thử lại.");
    });
});

router.get("/getone/", async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      await getOneService(BlogsModel, id)
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          res.status(500).json("Có lỗi. Vui lòng thử lại.");
        });
    } else {
      res.status(500).json("Có lỗi. Vui lòng thử lại.");
    }
  } catch (err) {
    if (err) throw err;
  }
});

router.put("/updateone/", verifyMiddleware.verifyEmployee, async (req, res) => {
  try {
    const { id } = req.query;
    const { data } = req.body;
    const message = {
      success: "Sửa tin tức thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    await updateOneService(BlogsModel, id, data)
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
        await deleteOneService(BlogsModel, id)
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
        res.status(500).json("Có lỗi. Vui lòng thử lại.");
      }
    } catch (err) {
      if (err) throw err;
    }
  }
);

module.exports = router;
