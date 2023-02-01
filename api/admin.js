const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/Admin.js");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, ...others } = req.body.data;
    // Lấy thông tin user gửi lên
    const messages = {
      messageUserField: "",
      messageEmailField: "",
      messagePasswordField: "",
      messageMain: "",
    };
    // Kiếm tra user có trong DB hay không
    const adminDB = await AdminModel.findOne({
      username,
    });

    const emailDB = await AdminModel.findOne({
      email,
    });

    if (adminDB) {
      messages.messageUserField = "Tên tài khoản đã tồn tại";
    }

    if (emailDB) {
      messages.messageEmailField = "Email đã tồn tại";
    }

    if (!adminDB && !emailDB) {
      //   Nếu user không có thì hash password và lưu vào DB
      const salt = bcryptjs.genSaltSync(10);
      const hashPassword = bcryptjs.hashSync(password, salt);

      await AdminModel.create({
        username,
        email,
        password: hashPassword,
        ...others,
      })
        .then(() => {
          messages.messageMain = "Tạo tài khoản thành công.";
        })
        .catch((err) => {
          messages.messageMain = err;
        });
      res.status(200).json({
        username,
        success: true,
        messages,
      });
    } else {
      res.status(500).json({
        success: false,
        messages,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body.data;
    const messages = {
      messageUserField: "",
      messageEmailField: "",
      messagePasswordField: "",
      messageMain: "",
    };
    const adminDB = await AdminModel.findOne({
      username,
    });

    if (adminDB) {
      bcryptjs
        .compare(password, adminDB.password)
        .then(async (result) => {
          if (result) {
            const payload = {
              username,
              id: "" + adminDB._id,
              roleId: adminDB.roleId,
            };
            const accessToken = jwt.sign(
              payload,
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "6h",
              }
            );

            // Lưu AccessToken vào cookie
            res.cookie("token", accessToken);

            if (accessToken) {
              AdminModel.updateOne(
                { username },
                {
                  $set: {
                    accessToken,
                  },
                },
                (err) => {
                  if (err) throw err;
                }
              );
            }

            const refeshToken = jwt.sign(
              payload,
              process.env.REFESH_TOKEN_SECRET,
              {
                expiresIn: "1d",
              }
            );
            if (refeshToken) {
              AdminModel.updateOne(
                { username },
                {
                  $set: {
                    refeshToken,
                  },
                },
                (err) => {
                  if (err) throw err;
                }
              );
            }
            messages.messageMain = "Đăng nhập thành công.";
            res.status(200).json({
              success: true,
              username,
              id: adminDB._id,
              roleId: adminDB.roleId,
              messages,
            });
          } else {
            messages.messagePasswordField = "Sai mật khẩu";
            res.status(500).json({
              success: false,
              messages,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      messages.messageUserField = "Tài khoản không tồn tại";
      res.status(500).json({
        success: false,
        messages,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
