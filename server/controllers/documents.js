const connection = require('../connection').connection;

exports.get_documents = (req, res) => {
    connection.query('SELECT id, title, date_created, date_edited FROM document', (err, rows) => {
        if (err) throw err;

        res.send({documents: rows});
    })
};
