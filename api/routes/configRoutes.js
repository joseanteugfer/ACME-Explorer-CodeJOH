const express = require('express');
const router = express.Router();
const config = require('../controllers/configControllers');

router.post('/v1/config/', config.save_config);
router.put('/v1/config/:configId', config.update_config);

module.exports = router;