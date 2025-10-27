const express = require('express');
const router = express.Router();
const { getShortestPath } = require('../controllers/shortestPath');

/* const player1 = encodeURIComponent("Roy Keane");
const player2 = encodeURIComponent("Xabi Alonso");*/
router.get('/', getShortestPath);
//has to be called like: GET /shortestPath?player1=Roy%20Keane&player2=Xabi%20Alonso

module.exports = router;