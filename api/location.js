const router = require("express").Router();
const CitiesModel = require("../models/Cities.js");
const DistrictsModel = require("../models/Districts.js");
const WardsModel = require("../models/Wards.js");

router.get("/getlistCity", async (req, res) => {
  try {
    await CitiesModel.find()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    if (err) throw err;
  }
});

router.get("/getlistDistrict/", async (req, res) => {
  try {
    const { id } = req.query;
    await DistrictsModel.find({ codeCity: id })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    if (err) throw err;
  }
});

router.post("/addoneDistrict", async (req, res) => {
  try {
    const data = req.body;
    await DistrictsModel.create(data)
      .then((result) => {
        res.status(200).json("Thành công");
      })
      .catch((err) => {
        res.status(500).json("Lỗi");
      });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/getlistWard/", async (req, res) => {
  try {
    const { id } = req.query;
    await WardsModel.find({ codeDistrict: id })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    if (err) throw err;
  }
});

module.exports = router;
