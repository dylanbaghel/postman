//THIRD PARTY MODULES
const express = require('express');
const router = express.Router();

//CUSTOM MODULES FILES
const { Post } = require('./../models/Post');
const { authenticate } = require('./../middleware/authenticate');

//ROUTES

//GET - /posts/add - GET ADD NEW POST FORM
router.get('/add', authenticate, (req, res) => {
    res.render('posts/add');
});

//POST - /posts - ADD NEW POST TO THE DATABASE
router.post('/', authenticate, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({error_text: 'Please Enter The Title'});
    }
    if (!req.body.postBody) {
        errors.push({error_text: 'Please Enter Your Post'});
    }
    if (errors.length > 0) {
        res.render('posts/add', { errors });
    } else {
        let allowComments;
        if (req.body.allowComments === 'on') {
            allowComments = true;
        } else {
            allowComments = false;
        }
        
        let post  = new Post({
            title: req.body.title,
            status: req.body.status,
            allowComments: allowComments,
            postBody: req.body.postBody,
            _creator: req.user._id
        });

        post.save().then((post) => {
            req.flash('success_msg', 'Post Added Successfully');
            res.redirect('/dashboard');
        });
    }
});

//GET - /posts - SHOW PUBLIC POSTS
router.get('/', (req, res) => {
    Post.find({
        status: 'public'
    }).sort({ date: 'DESC' }).populate('_creator').then((posts) => {
        res.render('posts/posts', { posts });
    });
});

//GET - /posts/show/:id - SHOW PARTICULAR POST
router.get('/show/:id', (req, res) => {
    Post.findOne({
        _id: req.params.id
    }).populate('_creator').populate('comments.commentUser').sort({ date: 'DESC' }).then((post) => {
        if (post.status === 'public') {
            res.render('posts/show', { post });
        } else {
            if (req.user) {
                if (post._creator._id.toHexString() === req.user._id.toHexString()) {
                    res.render('posts/show', { post });
                } else {
                    res.redirect('/dashboard');
                }
            } else {
                res.redirect('/');
            }
        }
    });
});

//GET - /posts/edit/:id - SHOW EDIT FORM   
router.get('/edit/:id', authenticate, (req, res) => {
    Post.findOne({
        _id: req.params.id
    }).then((post) => {
        if (post._creator.toHexString() !== req.user._id.toHexString()) {
            res.redirect('/dashboard');
        } else {
            res.render('posts/edit', { post });
        }
    });
});

//PUT - /posts/:id - EDIT THE POST
router.put('/:id', authenticate, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({error_text: 'Please Enter The Title'});
    }
    if (!req.body.postBody) {
        errors.push({error_text: 'Please Enter Your Post'});
    }
    if (errors.length > 0) {
        res.render('posts/add', { errors });
    } else {
        let allowComments;
        if (req.body.allowComments === 'on') {
            allowComments = true;
        } else {
            allowComments = false;
        }
        
        Post.findOneAndUpdate({
            _id: req.params.id
        }, {$set: {
            title: req.body.title,
            postBody: req.body.postBody,
            status: req.body.status,
            allowComments: allowComments
        }}).then((post) => {
            req.flash('success_msg', 'Post Edited Successfully');
            res.redirect('/dashboard');
        });
    }
})

//DELETE - /posts/:id - DELETE THE POST
router.delete('/:id', authenticate, (req, res) => {
    Post.findOneAndRemove({
        _id: req.params.id
    }).then((post) => {
        req.flash('success_msg', 'Post Deleted Successfully');
        res.redirect('/dashboard');
    });
});

//GET - /posts/user/:id - GET PARTICULAR USER POSTS
router.get('/user/:id', (req, res) => {
    Post.find({
        _creator: req.params.id,
        status: 'public',
    }).sort({ date: 'DESC' }).populate('_creator').then((posts) => {
        res.render('posts/posts', { posts });
    })
});

//GET - /posts/my - GET LOGGED IN USER POSTS
router.get('/my', authenticate, (req, res) => {
    Post.find({
        _creator: req.user._id
    }).sort({ date: 'DESC' }).populate('_creator').then((posts) => {
        res.render('posts/posts', { posts });
    });
})

//POST - /posts/comments/:id  - COMMENTING FEATURE;
router.post('/comments/:id', (req, res) => {
    let errors = [];
    if (!req.body.commentBody) {
        errors.push({text: 'Comment Box Cannot Be Empty'});
    }
    if (errors.length > 0) {
        res.redirect(`/posts/show/${req.params.id}`);
    } else {
        Post.findOne({
            _id: req.params.id
        }).then((post) => {
            let newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user._id
            };

            post.comments.unshift(newComment);

            post.save().then((post) => {
                req.flash('success_msg', `You Commented Successfully`);
                res.redirect(`/posts/show/${post._id}`);
            });
        })
    }
});

//DELETE - /posts/comment/:postId/:commentId - DELETE PARTICULAR COMMENT
router.delete('/comments/:postId/:commentId', (req, res) => {
    Post.findOne({
        _id: req.params.postId
    }).then((post) => {
        let filteredComments = post.comments.filter((comment) => {
            return comment._id.toHexString() !== req.params.commentId;
        });

        post.comments = filteredComments;
        post.save().then((post) => {
            res.redirect(`/posts/show/${req.params.postId}`);
        })
    })
});

module.exports = router;