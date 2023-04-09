const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
    },
    url: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('apilogs', schema) //apilogs is the name of the collection in the db