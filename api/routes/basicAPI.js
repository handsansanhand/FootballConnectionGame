const express = require('express');
const router = express.Router();
const { basicGet } = require('../controllers/basicGet');

router.get('/', basicGet);

module.exports = router;