const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    labels: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 9']
    },
    backgroundColor: {
        type: String,
        default: '#ffffff' // default white background
    },
    archived: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletionDate: {
        type: Date
    },
    date: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        required: true
    }
    
});

function arrayLimit(val) {
    return val.length <= 9;
}

module.exports = mongoose.model('Note', NoteSchema);
