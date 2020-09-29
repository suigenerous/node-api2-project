// imports express
const express = require('express');

// import postRoutes
const postRoutes = require('./postRoutes');

// create express instance
const server = express();

// setup server for json
server.use(express.json());

// use post routes
server.use('/api/posts', postRoutes);

// set server running on port 5000
server.listen(5000, () => console.log('server running port 5000'));