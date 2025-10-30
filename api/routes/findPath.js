const express = require('express');
const router = express.Router();
const { guess } = require('../controllers/findPath');

router.post('/', guess);

module.exports = router;