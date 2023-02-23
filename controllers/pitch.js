/** @format */

const router = require("express").Router();
const PitchsModel = require("../models/Pitchs.js");
const verifyMiddleware = require("../middleware/verifyMiddleware.js");
const { checkTime } = require("../services/checkTime.js");

router.post("/addone", async (req, res) => {
  try {
    const message = {
      success: "Thêm sân bóng thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    const data = req.body;
    // let listidParent = [];
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
          let dataChildren = { id: uniqueId, title: `${j}`, timeBooking: [] };
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

router.get("/getlist/", async (req, res) => {
  const { page } = req.query;
  const perPage = 8;
  if (page) {
    await PitchsModel.find()
      .limit(perPage)
      .skip(perPage * (page - 1))
      .then((result) => {
        const minMaxPrice = [];
        for (let i = 0; i < result.length; i++) {
          const arrayPrice = [];
          for (let j = 0; j < result[i]?.listPitchs.length; j++) {
            let listPitch = result[i]?.listPitchs[j];
            for (let x = 0; x < listPitch?.infoPitchs.length; x++) {
              const price = Number(listPitch?.infoPitchs[x]?.price);
              arrayPrice.push(price);
            }
          }
          minMaxPrice.push({
            minPrice: Number(Math.min(...arrayPrice)),
            maxPrice: Number(Math.max(...arrayPrice)),
          });
        }
        res.status(200).json({
          success: true,
          message: "Thành công",
          pagination: {
            currentPage: page,
            length: result?.length,
          },
          result: result.map((item, index) => {
            return {
              key: "" + item?._id,
              ...item?._doc,
              ...minMaxPrice[index],
            };
          }),
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

router.get("/getall", async (req, res) => {
  try {
    await PitchsModel.find()
      .then((result) => {
        const minMaxPrice = [];
        for (let i = 0; i < result.length; i++) {
          const arrayPrice = [];
          for (let j = 0; j < result[i]?.listPitchs.length; j++) {
            let listPitch = result[i]?.listPitchs[j];
            for (let x = 0; x < listPitch?.infoPitchs.length; x++) {
              const price = Number(listPitch?.infoPitchs[x]?.price);
              arrayPrice.push(price);
            }
          }
          minMaxPrice.push({
            minPrice: Number(Math.min(...arrayPrice)),
            maxPrice: Number(Math.max(...arrayPrice)),
          });
        }
        res.status(200).json({
          success: true,
          message: "Thành công",
          result: result.map((item, index) => {
            return {
              key: "" + item?._id,
              ...item?._doc,
              ...minMaxPrice[index],
            };
          }),
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

// Lấy danh sách thời gian trống
router.post("/find-empty-pitchs", async (req, res) => {
  try {
    const { keyMainPitch, idParent, idChildren, duration, date } = req.body;
    const arrayResponse = [];

    PitchsModel.findById(keyMainPitch)
      .then((pitchMain) => {
        const pitchToFind = pitchMain?.listPitchs.find(
          (item) => item?.id === idParent
        );
        const pitchChildToFind = pitchToFind?.children.find(
          (itemChild) => itemChild?.id === idChildren
        );

        if (pitchChildToFind) {
          for (let i = 0; i < pitchToFind?.infoPitchs.length; i++) {
            const dateStart = Date.parse(pitchToFind?.infoPitchs[i]?.day[0]);
            const dateEnd = Date.parse(pitchToFind?.infoPitchs[i]?.day[1]);
            const dateToFind = Date.parse(date);

            const pricePitch = pitchToFind?.infoPitchs[i]?.price;

            if (dateToFind >= dateStart && dateToFind <= dateEnd) {
              const timeStart = pitchToFind?.infoPitchs[i]?.hour[0];
              const timeEnd = pitchToFind?.infoPitchs[i]?.hour[1];

              const timeStartConverted = new Date(
                "2023-02-18T" + timeStart
              ).getTime();
              const timeEndConverted = new Date(
                "2023-02-18T" + timeEnd
              ).getTime();

              for (
                let j = timeStartConverted;
                j <= timeEndConverted;
                j += 30 * 60 * 1000
              ) {
                const timeLoopCurrent = j;
                let skipLoop = false;

                for (let x = 0; x < pitchChildToFind?.timeBooking.length; x++) {
                  const dateBooked = Date.parse(
                    pitchChildToFind?.timeBooking[x]?.day
                  );

                  if (dateBooked === dateToFind) {
                    const timeStartPitchBooked = new Date(
                      "2023-02-18T" + pitchChildToFind?.timeBooking[x]?.hour[0]
                    ).getTime();
                    const timeEndPitchBooked = new Date(
                      "2023-02-18T" + pitchChildToFind?.timeBooking[x]?.hour[1]
                    ).getTime();

                    if (
                      (timeLoopCurrent >= timeStartPitchBooked &&
                        timeLoopCurrent < timeEndPitchBooked) ||
                      (timeLoopCurrent + Number(duration) * 60 * 1000 >=
                        timeStartPitchBooked &&
                        timeLoopCurrent + Number(duration) * 60 * 1000 <
                          timeEndPitchBooked)
                    ) {
                      skipLoop = true;
                    }
                  } else {
                    continue;
                  }
                }

                if (skipLoop) {
                  continue;
                }

                const timeResponse = new Date(timeLoopCurrent)
                  .toTimeString()
                  .slice(0, 5);

                if (checkTime(arrayResponse, timeResponse) !== 0) {
                  const position = checkTime(arrayResponse, timeResponse);
                  arrayResponse[position - 1] = {
                    time: timeResponse,
                    price: pricePitch,
                    saleOff: true,
                    decrease:
                      ((Number(arrayResponse[position - 1].price) -
                        Number(pricePitch)) /
                        Number(arrayResponse[position - 1].price)) *
                      100,
                  };
                } else {
                  arrayResponse.push({
                    time: timeResponse,
                    price: pricePitch,
                    saleOff: false,
                    decrease: 0,
                  });
                }
              }
            }
          }
        }

        res.status(200).json({
          success: true,
          message: "Thành công",
          result: arrayResponse,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Thất bại",
          errors: err,
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Thất bại",
      errors: err,
    });
  }
});

// router.get('/filter-pitchs', async (req, res) => {
//   try {
//     const data = req.query
//   }
//   catch(err) {
//     console.log(err)
//   }
// })

module.exports = router;
