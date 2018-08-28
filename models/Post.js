const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    postBody: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        default: 'public'
    },
    comments: [{
        commentBody: {
            type: String,
            required: true
        },
        commentUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        commentDate: {
            type: Date,
            default: Date.now
        }
    }],
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Post = mongoose.model('Post', PostSchema);
module.exports = { Post };