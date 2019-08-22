const connection = require('../connection').pool;

exports.get_documents = (req, res) => {
    connection.query('SELECT id, title, date_created, date_edited FROM document', (err, rows) => {
        if (err) throw err;

        res.send({documents: rows});
    })
};

exports.get_document_by_id = (req, res) => {
    connection.query(
        `SELECT id, title, date_created, date_edited FROM document WHERE id = ${req.params.documentId}`,
        (err, rows) => {
            if (err) throw err;

            res.send({document: rows[0]});
        }
    )
};

exports.get_document_sections = (req, res) => {
    connection.query(
        `SELECT id, document_id, section_number, title, text
        FROM document_section 
        WHERE document_id = ${req.params.documentId}`,
        (err, rows) => {
            if (err) throw err;

            res.send({sections: rows});
        }
    )
};

exports.get_document_section = (req, res) => {
    connection.query(
        `SELECT id, document_id, section_number, title, text
        FROM document_section 
        WHERE 
            document_id = ${req.params.documentId} 
                AND
            section_number = ${req.params.sectionNumber}`,
        (err, rows) => {
            if (err) throw err;

            res.send({section: rows[0]});
        }
    )
};


exports.get_document_annotations = (req, res) => {
    connection.query(
        `SELECT id, document_id, section_id, start, end, tag
        FROM section_annotation 
        WHERE document_id = ${req.params.documentId}`,
        (err, rows) => {
            if (err) throw err;

            res.send({annotations: rows});
        }
    )
};

exports.get_document_annotations_by_section_number = (req, res) => {
    connection.query(
        `
        SELECT id, document_id, section_id, start, end, tag 
        FROM section_annotation 
        WHERE 
            document_id = ${req.params.documentId} 
                AND 
            section_id = ( 
                SELECT document_section.id 
                FROM document_section 
                WHERE 
                    document_section.document_id = ${req.params.documentId} 
                        AND 
                    document_section.section_number = ${req.params.sectionNumber} 
            )
        `,
        (err, rows) => {
            if (err) throw err;

            res.send({annotations: rows});
        }
    )
};
