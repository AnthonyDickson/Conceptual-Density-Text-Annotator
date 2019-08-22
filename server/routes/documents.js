var express = require('express');
var router = express.Router();

var controllers = require('../controllers/documents');

router.get('/', controllers.get_documents);
router.get('/:documentId', controllers.get_document_by_id);

module.exports = router;
