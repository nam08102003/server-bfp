const router = require('express').Router();
const PitchsModel = require('../models/Pitchs.js');

router.get('/getlist', async (req, res) => {
  await PitchsModel.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get('/getone/', async (req, res) => {
  const { id } = req.query;
  if (id) {
    await PitchsModel.findById(id)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    res.status(500).json('Lỗi!!');
  }
});

router.post('/addone', async (req, res) => {
  const { data } = req.body;
  if (data) {
    await PitchsModel.create(data)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
});

router.put('/updateone/', async (req, res) => {
  const { id } = req.query;
  const { data } = req.body;
  if (id) {
    await PitchsModel.findByIdAndUpdate(id, data)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
});

router.delete('/deleteone/', async (req, res) => {
  const { id } = req.query;
  if (id) {
    await PitchsModel.findByIdAndDelete(id)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
});

module.exports = router;
