const express = require('express');
const router = express.Router();

const controllers = require('../controllers/index');

router.get('/', controllers.get_api_root);

module.exports = router;
