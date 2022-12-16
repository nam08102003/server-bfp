const router = require('express').Router();
const BookingModel = require('../models/Booking.js');

router.get('/getlist', async (req, res) => {
  try {
    await BookingModel.find()
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
      await BookingModel.findById(id)
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
    await BookingModel.create(data)
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
      await BookingModel.findByIdAndUpdate(id, data)
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
      await BookingModel.findByIdAndDelete(id)
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

module.exports = router;
