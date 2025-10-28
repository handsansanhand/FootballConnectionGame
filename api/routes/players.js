const express = require('express');
const router = express.Router();
const { searchPlayers, getRandomPlayer } = require('../controllers/players');

router.get('/', searchPlayers);
router.get('/random', getRandomPlayer);

module.exports = router;