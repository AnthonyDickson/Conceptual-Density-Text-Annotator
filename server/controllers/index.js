const connection = require('../connection').pool;

exports.get_api_root = (req, res) => {
    res.send({message: "Hello, World!"});
};

exports.get_next_section_id = (req, res) => {
    connection.query(`SELECT MAX(id) AS nextId
                      FROM document_section`, (err, rows) => {
        if (err) throw err;

        res.send({nextId: rows[0]['nextId'] + 1});
    });
};
