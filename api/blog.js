const router = require('express').Router();
const BlogsModel = require('../models/Blogs.js');
const verifyMiddleware = require('../middleware/verifyMiddleware.js');

router.post('/addone', async (req, res) => {
  try {
    const { data } = req.body;

    if (data) {
      await BlogsModel.create(data)
        .then(() => {
          res.status(200).json('Thêm tin thành công.');
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    } else {
      res.status(500).json('Lỗi');
    }
  } catch (err) {
    if (err) throw err;
  }
});

router.get('/getlist', async (req, res) => {
  const listBlog = await BlogsModel.find();
  if (listBlog) {
    res.status(200).json(listBlog);
  }
});

router.get('/getone/', async (req, res) => {
  const { id } = req.query;
  if (id) {
    await BlogsModel.findById(id)
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

router.put('/updateone/', verifyMiddleware.verifyEmployee, async (req, res) => {
  const { id } = req.query;
  const { data } = req.body;
  if (id) {
    await BlogsModel.findByIdAndUpdate(id, data)
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

router.delete('/deleteone/', verifyMiddleware.verifyEmployee, async (req, res) => {
  const { id } = req.query;
  if (id) {
    await BlogsModel.findByIdAndDelete(id)
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

module.exports = router;
