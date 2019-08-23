const express = require('express');
const router = express.Router();

const controllers = require('../controllers/index');

router.get('/', controllers.get_api_root);
router.get('/sections/nextId', controllers.get_next_section_id);

module.exports = router;
