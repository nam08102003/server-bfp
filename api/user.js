const router = require("express").Router();
const UsersModel = require("../models/Users.js");
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
    const data = req.body.data;
    const message = {
      success: "Thêm tài khoản thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    const result = createNewService(UsersModel, data);
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
  await getListService(UsersModel)
    .then((result) => {
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
      await getOneService(UsersModel, id)
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

router.put("/updateone/", async (req, res) => {
  try {
    const { id } = req.query;
    const data = req.body.data;
    const message = {
      success: "Sửa tài khoản thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    await updateOneService(UsersModel, id, data)
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
      await deleteOneService(UsersModel, id)
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
});

module.exports = router;
