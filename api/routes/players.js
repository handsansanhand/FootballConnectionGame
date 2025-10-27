const express = require('express');
const router = express.Router();
const { searchPlayers } = require('../controllers/players');

router.get('/', searchPlayers);

module.exports = router;