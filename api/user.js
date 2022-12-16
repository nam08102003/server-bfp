const router = require('express').Router();
const UsersModel = require('../models/Users.js');
const verifyMiddleware = require('../middleware/verifyMiddleware.js');

router.get('/getlist', async (req, res) => {
  try {
    const listUsers = await UsersModel.find();
    res.status(200).json(listUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/getone/', async (req, res) => {
  try {
    const { id } = req.query;
    await UsersModel.findOne({ _id: id })
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
    await UsersModel.findByIdAndUpdate(id, data)
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

router.delete('/deleteone/', verifyMiddleware.verifyAdmin, async (req, res) => {
  const { id } = req.query;
  await UsersModel.findByIdAndDelete({ id })
    .then(() => {
      res.status(200).json('Delete user success');
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
