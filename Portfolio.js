const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Portfolio", portfolioSchema);