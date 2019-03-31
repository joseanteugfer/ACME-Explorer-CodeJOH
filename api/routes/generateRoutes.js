const express = require('express');
const router = express.Router();
const generate = require('../controllers/generateController')

router.post('/v1/generate_db/', generate.generateData);
router.post('/v1/generate_big_json/', generate.generateBigData);

module.exports = router;