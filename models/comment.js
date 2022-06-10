const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
    {
        postId: String,
        userId: String,
        commentContent: String,
    },
    { timestamps: true }
);

CommentSchema.virtual('commentId').get(function () {
    return this._id.toHexString();
});
CommentSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Comment', CommentSchema);
