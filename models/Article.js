const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    link: {
        type: String,
        required: true
    },
    imgLink: String,
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    },
    read: {
        type: Boolean,
        default: false
    }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;