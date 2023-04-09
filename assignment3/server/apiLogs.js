const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: String,
        required: true
    },
    endpoint: {
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
    response_time: {
        type: Number,
        required: true
    },
    request_body: {
        type: Object,
        required: true
    },
    response_body: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('apilogs', schema) //apilogs is the name of the collection in the db