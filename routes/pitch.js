/** @format */

const router = require("express").Router();
const PitchsModel = require("../models/Pitchs.js");
const verifyMiddleware = require("../middleware/verifyMiddleware.js");
const getMinMax = require("../services/getMinMax.js");

router.post("/addone", async (req, res) => {
  try {
    const message = {
      success: "Thêm sân bóng thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    const data = req.body;
    // let listIdPitch = [];
    let { listPitchs, ...others } = data;

    if (listPitchs.length > 0) {
      for (let i = 1; i <= listPitchs.length; i++) {
        // const dataPitch = listPitchs[i - 1];
        const amountPitch = Number(listPitchs[i - 1].amountPitch);
        listPitchs[i - 1].children = [];
        for (let j = 1; j <= amountPitch; j++) {
          const randomId = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          };
          const uniqueId =
            randomId() +
            randomId() +
            randomId() +
            randomId() +
            randomId() +
            randomId();
          console.log(uniqueId);
          // const dataPitchDetail = { ...dataPitch, children}
          let dataChildren = { id: uniqueId, title: `${j}`, isBooking: false };
          listPitchs[i - 1].children.push(dataChildren);
          // const newPitch = await PicthDetailModel.create(dataPitch);
          // const idPitch = "" + newPitch._id;
          // listIdPitch.push(idPitch);
        }
      }

      const dataCreate = { listPitchs, ...others };
      await PitchsModel.create(dataCreate)
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
      res.status(500).json("Không có thông tin sân bóng");
    }
  } catch (err) {
    if (err) throw err;
  }
});

router.get("/getall", async (req, res) => {
  try {
    await PitchsModel.find()
      .then((result) => {
        getMinMax()
          .then((minMaxPrice) => {
            console.log(minMaxPrice);
            const arrayResponse = [];
            result?.forEach((item) => {
              minMaxPrice?.forEach((dataCurrent) => {
                if (item?._id.equals(dataCurrent?._id)) {
                  const data = {
                    key: "" + item?._id,
                    ...item?._doc,
                    minPrice: dataCurrent?.minPrice,
                    maxPrice: dataCurrent?.maxPrice,
                  };
                  arrayResponse.push(data);
                }
              });
            }),
              res.status(200).json({
                success: true,
                message: "Thành công",
                result: arrayResponse,
              });
          })
          .catch((err) => {
            res.status(500).json({
              success: false,
              message: "Có lỗi. Vui lòng thử lại",
              errors: err,
            });
          });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Có lỗi. Vui lòng thử lại",
          errors: err,
        });
      });
  } catch (err) {
    res.status(500).json({
      errors: err,
      success: false,
      message: "Có lỗi. Vui lòng thử lại",
    });
  }
});

router.get("/getlist/", async (req, res) => {
  const { page } = req.query;
  const perPage = 8;
  if (page) {
    await PitchsModel.find()
      .limit(perPage)
      .skip(perPage * (page - 1))
      .then(async (result) => {
        // const minMaxPrice = await getMinMax.getMinMaxPricePitchs();
        const arrayResponse = [];
        // result.map((item) => {
        //   minMaxPrice.forEach((dataCurrent) => {
        //     if (item._id.equals(dataCurrent._id)) {
        //       const data = {
        //         key: "" + item._id,
        //         ...item._doc,
        //         minPrice: dataCurrent.minPrice,
        //         maxPrice: dataCurrent.maxPrice,
        //       };
        //       arrayResponse.push(data);
        //     }
        //   });
        // }),
        res.status(200).json({
          success: true,
          message: "Thành công",
          pagination: {
            currentPage: page,
            length: result.length,
          },
          result: arrayResponse,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Có lỗi. Vui lòng thử lại",
          errors: err,
        });
      });
  }
});

router.get("/getone/", async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      await PitchsModel.findById(id)
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
      success: "Sửa sân bóng thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    await PitchsModel.findByIdAndUpdate(id, data)
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
      success: "Xóa sân bóng thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    if (id) {
      await PitchsModel.findByIdAndDelete(id)
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
