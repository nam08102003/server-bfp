const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const UsersModel = require("../models/Users.js");
const verifyMiddleware = require("../middleware/verifyMiddleware.js");

router.post("/addone", async (req, res) => {
  try {
    const data = req.body;
    const message = {
      success: "Thêm tài khoản thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    const { password } = data;
    const salt = bcryptjs.genSaltSync(10);
    const hashPassword = bcryptjs.hashSync(password, salt);

    await UsersModel.create({ ...data, password: hashPassword, roleId: 3 })
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
    await UsersModel.find({ roleId: 3 })
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
            const { password, ...others } = item;
            const dataUser = others._doc;
            delete dataUser["password"];
            return {
              key: "" + item._id,
              ...dataUser,
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
  await UsersModel.find({ roleId: 3 })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Thành công",
        result: result.map((item) => {
          const { password, ...others } = item;
          const dataUser = others._doc;
          delete dataUser["password"];
          return {
            key: "" + item._id,
            ...dataUser,
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
      await UsersModel.findById(id)
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
      success: "Sửa tài khoản thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    await UsersModel.findByIdAndUpdate(id, data)
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
      success: "Xóa tài khoản thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    if (id) {
      await UsersModel.findByIdAndDelete(id)
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
