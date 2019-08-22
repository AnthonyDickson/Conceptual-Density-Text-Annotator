require('dotenv').config();
require('./connection').connection.connect();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Routes
const indexRouter = require('./routes/index');
const documentRouter = require('./routes/documents');

// App Setup
const app = express();
const port = process.env.API_PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes
app.use('/api', indexRouter);
app.use('/api/documents', documentRouter);

// Static file serving for production build.
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));