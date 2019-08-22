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

exports.set_document_annotations = (req, res) => {
    const annotations = req.body.annotations;
    const documentId = parseInt(req.params.documentId);
    const values = [];

    for (const sectionId in annotations) {
        if (annotations.hasOwnProperty(sectionId)) {
            const sectionIdInt = parseInt(sectionId);

            values.push(...annotations[sectionId].map(annotation => {
                return [documentId, sectionIdInt, annotation.start, annotation.end, annotation.tag];
            }));
        }
    }

    connection.query(
        `DELETE FROM section_annotation WHERE document_id = ${documentId}`, (err) => {
            if (err) throw err;
            console.log('deleted');

            connection.query(
                'INSERT INTO section_annotation (document_id, section_id, start, end, tag) VALUES ?',
                [values],
                (err) => {
                    if (err) throw err;


                    console.log('inserted');


                    connection.query(
                        `UPDATE document SET date_edited = NOW() WHERE id = ${documentId}`,
                        (err) => {
                            if (err) throw err;

                            console.log('updated');

                            res.status(200);
                            res.send();
                        });
                }
            );
        });
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
