var express = require('express');
var router = express.Router();

var controllers = require('../controllers/documents');

// Documents
router.get('/', controllers.get_documents);
router.post('/', controllers.post_document);
router.get('/:documentId', controllers.get_document_by_id);
router.put('/:documentId', controllers.put_document_by_id);
router.get('/:documentId/xml', controllers.get_annotated_document);
router.post('/:documentId/copy', controllers.copy_document_by_id);
router.delete('/:documentId', controllers.delete_document_by_id);

// Sections
router.get('/:documentId/sections', controllers.get_document_sections);
router.patch('/:documentId/sections', controllers.set_document_sections);
router.get('/:documentId/sections/:sectionNumber', controllers.get_document_section);

// Annotations
router.get('/:documentId/annotations', controllers.get_document_annotations);
router.patch('/:documentId/annotations', controllers.set_document_annotations);
router.get('/:documentId/sections/:sectionNumber/annotations', controllers.get_document_annotations_by_section_number);

module.exports = router;
