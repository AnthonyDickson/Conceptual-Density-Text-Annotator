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
