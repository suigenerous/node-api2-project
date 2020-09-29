// import express and create router instance
const express = require('express');
const router = express.Router();
router.use(express.json());
const db = require('./data/db')

// post request for making a new post
router.post('/', (req, res) => {
    const body = req.body;
    if (body.title && body.contents){
        try {
            db.insert(body);
            res.status(201).json({data: body});
        } catch {
            res.status(500).json({ error: "There was an error while saving the post to the database" });
        };
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    };  
});

// post request for adding comment to a new post

router.post('/:id/comments', (res, req) => {
    const id = req.params.id;
    const body = req.body;
    if (body.text){
        try {
            const comment = {text: body.text, post_id: id};
            db.insertComment(comment)
                .then(res => {
                    db.findCommentById(res.id)
                        .then(res => {
                            res.status(201).json({data: res});
                        })
                        .catch (err => {
                            res.status(500).json({ error: "There was an error while saving the comment to the database" });
                        });
                })
                .catch (err => {
                    res.status(404).json({ message: "The post with the specified ID does not exist." });
                });
        } catch {
            res.status(500).json({ error: "There was an error while saving the comment to the database" });
        };
    } else {
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
    };
});

// get request for returning posts

// get request for returning specific post

// get request to return comments for a specific post

// delete request for removing a post

// put request for editing a post

// export router instance
module.exports = router;