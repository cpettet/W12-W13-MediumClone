var express = require('express');
var router = express.Router();
const {requireAuth} = require('../auth');
const { asyncHandler } = require("./utils");
const { Post } = require("../db/models");

router.get('/', requireAuth, asyncHandler(async (req, res, next) => {
  const userId = req.session.auth.userId;
  const posts = await Post.findAll({ where: { author_id: userId } });

  res.render('index', { posts });

}));

module.exports = router;
