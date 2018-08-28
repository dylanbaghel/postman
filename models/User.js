const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleID: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

let User = mongoose.model('User', UserSchema);
module.exports = { User };