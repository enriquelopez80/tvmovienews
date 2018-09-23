const mongoose = require("mongoose");

// Reference to the Schema constructor
const Schema = mongoose.Schema;

const CommentSchema = new Schema ({
    body: String
})

let Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
