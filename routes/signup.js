const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");

router.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

module.exports = router;