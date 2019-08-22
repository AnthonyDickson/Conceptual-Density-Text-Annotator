var express = require('express');
var router = express.Router();

var controllers = require('../controllers/documents');

router.get('/', controllers.get_documents);

module.exports = router;
