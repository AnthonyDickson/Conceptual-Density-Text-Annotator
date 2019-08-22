const connection = require('../connection').connection;

exports.get_documents = (req, res) => {
    connection.query('SELECT * FROM document', (err, rows) => {
        if (err) throw err;

        res.send({documents: rows});
    })
};