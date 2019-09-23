const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Tombaby Service' });
});

module.exports = router;
