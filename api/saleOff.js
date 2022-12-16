const router = require('express').Router();
const SaleOffModel = require('../models/SaleOff.js');

router.get('/getlist', async (req, res) => {
  try {
    await SaleOffModel.find()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/getone/', async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      await SaleOffModel.findById(id)
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/addone', async (req, res) => {
  try {
    const { data } = req.body;
    await SaleOffModel.create(data)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/updateone/', async (req, res) => {
  try {
    const { data } = req.body;
    const { id } = req.query;
    if (id) {
      await SaleOffModel.findByIdAndUpdate(id, data)
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/deleteone/', async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      await SaleOffModel.findByIdAndDelete(id)
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
