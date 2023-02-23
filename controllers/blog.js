/** @format */

const router = require("express").Router();
const BlogsModel = require("../models/Blogs.js");
const verifyMiddleware = require("../middleware/verifyMiddleware.js");

router.post("/addone", async (req, res) => {
  try {
    const data = req.body;
    const message = {
      success: "Thêm tin tức thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    if (data) {
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

router.get("/getlist/", async (req, res) => {
  const { page, amount, typeBlog } = req.query;
  const perPage = amount || 8;
  if (page) {
    if (typeBlog === "" || !typeBlog) {
      BlogsModel.find()
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
            result: result?.map((item) => {
              return {
                key: "" + item._id,
                ...item._doc,
              };
            }),
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            message: "Có lỗi. Vui lòng thử lại",
          });
        });
    } else {
      BlogsModel.find({ typeBlog })
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
            result: result?.map((item) => {
              return {
                key: "" + item._id,
                ...item._doc,
              };
            }),
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            success: false,
            message: "Có lỗi. Vui lòng thử lại",
          });
        });
    }
  }
});

router.get("/getall", async (req, res) => {
  await BlogsModel.find()
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Thành công",
        result: result.map((item) => {
          return {
            key: "" + item._id,
            ...item._doc,
          };
        }),
      });
    })
    .catch((err) => {
      console.log(err);
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
            result: {
              ...result._doc,
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

router.delete("/deleteone/", async (req, res) => {
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
});

router.put("/increaseviews", async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      await BlogsModel.findByIdAndUpdate(id, { $inc: { countRead: 1 } })
        .then(() => {
          res.status(200).json({
            success: true,
            message: "Thành công",
          });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
            message: "Thất bại",
            errors: err,
          });
        });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Thất bại",
      errors: err,
    });
  }
});

module.exports = router;
