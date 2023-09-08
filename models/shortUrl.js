const mongoose = require('mongoose')
const shortId = require('shortid')


const shortUrlSchema = new mongoose.Schema({
    Full_Url: {
        type: String,
        required: true
    },
    Short_Url: {
        type: String,
        required: true,
        default: shortId.generate
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    ipAddress: {
        type: String
    }
})

module.exports = mongoose.model('ShortUrl' , shortUrlSchema)