const router = require("express").Router();
const PitchsModel = require("../models/Pitchs.js");
const PicthDetailModel = require("../models/PitchDetail.js");
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
          let dataChildren = { id: uniqueId, title: `${j}` };
          listPitchs[i - 1].children.push(dataChildren);
          // const newPitch = await PicthDetailModel.create(dataPitch);
          // const idPitch = "" + newPitch._id;
          // listIdPitch.push(idPitch);
        }
      }
      const dataCreate = { listPitchs, ...others };
      const result = createNewService(PitchsModel, dataCreate);
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
    } else {
      res.status(500).json("Không có thông tin sân bóng");
    }
  } catch (err) {
    if (err) throw err;
  }
});

router.get("/getlist", async (req, res) => {
  await getListService(PitchsModel)
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
      await getOneService(PitchsModel, id)
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
      success: "Sửa sân bóng thành công.",
      fail: "Thất bại. Vui lòng thử lại",
    };
    await updateOneService(PitchsModel, id, data)
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
      await deleteOneService(PitchsModel, id)
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
