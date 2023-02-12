/** @format */

const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/Users.js");

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
    const usernameDB = await UsersModel.findOne({
      username,
    });

    const emailDB = await UsersModel.findOne({
      email,
    });

    if (usernameDB) {
      messages.messageUserField = "Tên tài khoản đã tồn tại";
    }

    if (emailDB) {
      messages.messageEmailField = "Email đã tồn tại";
    }

    if (!usernameDB && !emailDB) {
      //   Nếu user không có thì hash password và lưu vào DB
      const salt = bcryptjs.genSaltSync(10);
      const hashPassword = bcryptjs.hashSync(password, salt);

      await UsersModel.create({
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

    const userDB = await UsersModel.findOne({
      username,
    });
    if (userDB) {
      bcryptjs
        .compare(password, userDB.password)
        .then(async (result) => {
          if (result) {
            const payload = {
              username,
              id: "" + userDB._id,
              roleId: userDB.roleId,
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
              UsersModel.updateOne(
                { username },
                {
                  $set: {
                    accessToken,
                    statusActive: true,
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
              UsersModel.updateOne(
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
            await UsersModel.updateOne(
              {
                username,
              },
              {
                $set: {
                  statusActive: true,
                },
              }
            );
            messages.messageMain = "Đăng nhập thành công.";
            res.status(200).json({
              success: true,
              username,
              id: userDB._id,
              roleId: userDB.roleId,
              messages,
              isActive: true,
            });
          } else {
            messages.messagePasswordField =
              "Sai mật khẩu. Vui lòng nhập lại mật khẩu chính xác.";
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
      messages.messageUserField =
        "Tài khoản không tồn tại. Vui lòng đăng ký tài khoản.";
      res.status(500).json({
        success: false,
        messages,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/logout", async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      await UsersModel.findByIdAndUpdate(id, { statusActive: false })
        .then(() => {
          res.status(200).json({
            success: true,
            message: "Thành công",
          });
        })
        .catch((err) => {
          res.status(499).json({
            success: false,
            message: "Thất bại",
            errors: err,
          });
        });
    } else {
      res.status(499).json({
        success: false,
        message: "Thất bại.Không có id",
      });
    }
  } catch (err) {
    res.status(499).json({
      success: false,
      message: "Thất bại",
      errors: err,
    });
  }
});

module.exports = router;
