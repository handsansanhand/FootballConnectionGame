const express = require('express');
const router = express.Router();
const { guess, initializePath } = require('../controllers/findPath');

router.post('/', guess);
router.post('/initialize', initializePath);

module.exports = router;