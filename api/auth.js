const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/Users.js");

router.post("/register", async (req, res) => {
  try {
    // Lấy thông tin user gửi lên
    const { username, email, password, ...others } = req.body;
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
        // saveUser,
        username,
        email,
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
              id: userDB.id,
              roleId: userDB.roleId,
              admin: userDB.admin,
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
            messages.messageMain = "Đăng nhập thành công.";
            res.status(200).json({
              success: true,
              username,
              roleId: userDB.roleId,
              messages,
              accessToken,
              refeshToken,
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
    console.log(err);
  }
});

module.exports = router;
