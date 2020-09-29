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
            db.insert(body)
                .then (r => {
                    db.find(r.id)
                        .then(r => {
                            res.status(201).json({data: r});
                        })
                        .catch (err => {
                            res.status(500).json({ error: "There was an error while saving the post to the database" });
                        });
                })
                .catch (err => {
                    res.status(500).json({ error: "There was an error while saving the post to the database" });
                });
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
                .then(r => {
                    db.findCommentById(r.id)
                        .then(r => {
                            res.status(201).json({data: r});
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

router.get('/', (res, req) => {
    try {
        db.find()
            .then(r => {
                if (r != []){
                    res.status(200).json({data: r});
                }
                else {
                    res.status(500).json({ error: "The posts information could not be retrieved." });
                };
            })
            .catch (err => {
                res.status(500).json({ error: "The posts information could not be retrieved." });
            })
    } catch {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    };
});

// get request for returning specific post

router.get('/:id', (res, req) => {
    try {
        const id = req.params.id;
        db.findById(id)
            .then (r => {
                if (r != []){
                    res.status(200).json({data: r});
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." });
                };
            })
            .catch (err => {
                res.status(500).json({ error: "The post information could not be retrieved." });
            });
    } catch {
        res.status(500).json({ error: "The post information could not be retrieved." });
    };
});

// get request to return comments for a specific post

router.get('/:id/comments', (res, req) => {
    try {
        const id = req.params.id;
        db.findPostComments(id)
            .then (r => {
                if (r != []){
                    res.status(200).json({data: r});
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." });
                };
            })
            .catch (err => {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            });
    } catch {
        res.status(500).json({ error: "The comments information could not be retrieved." });
    }
});
// delete request for removing a post

router.delete('/:id', (res, req) => {
    try {
        const id = req.params.id;
        db.findById(id)
            .then (r => {
                if (r != []){
                    try{
                        db.remove(id)
                            .then(res2 => {
                                res.status(204).json({data: r});
                            })
                            .catch (err => {
                                res.status(500).json({ error: "The post could not be removed" });
                            });
                    } catch {
                        res.status(500).json({error: "internal server error"})
                    };
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." });
                };
            })
            .catch (err => {
                res.status(500).json({ error: "The post information could not be retrieved." });
            });
    } catch {
        res.status(500).json({ error: "internal server error or invalid request" });
    };
});

// put request for editing a post

router.put('/:id', (res, req) => {
    const id = req.params.id;
    const body = req.body;
    db.findById(id)
        .then (r => {
            if (r != []){
                if (body.title && body.contents){
                    try {
                        db.update(id, body)
                            .then (r => {
                                if (r == 1){
                                    db.findById(id)
                                        .then (r => {
                                            res.status(200).json({data: r});
                                        })
                                        .catch (err => {
                                            res.status(500).json({ error: "The post information could not be modified." });
                                        });
                                }
                                else {
                                    res.status(500).json({ error: "The post information could not be modified." });
                                }
                            })
                            .catch (err => {
                                res.status(500).json({ error: "The post information could not be modified." });
                            });
                    } catch {
                        res.status(500).json({ error: "The post information could not be modified." });
                    }
                } else {
                    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
                };
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch (err => {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        });
})


// export router instance
module.exports = router;