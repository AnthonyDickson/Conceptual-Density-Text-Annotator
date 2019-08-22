var express = require('express');
var router = express.Router();

var controllers = require('../controllers/documents');

router.get('/', controllers.get_documents);
router.get('/:documentId', controllers.get_document_by_id);
router.get('/:documentId/sections', controllers.get_document_sections);
router.get('/:documentId/sections/:sectionNumber', controllers.get_document_section);

module.exports = router;
