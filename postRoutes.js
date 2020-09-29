// import express and create router instance
const express = require('express');
const router = express.Router();
router.use(express.json());
const db = require('./data/db')

// post request
router.post('/', (req, res) => {
    
});

// export router instance
module.exports = router;