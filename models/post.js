const mongoose = require('mongoose');

const PostSchema = mongoose.Schema(
    {
        title: String,
        //thumbnail,
        content: String,
        userId: String,
        postPassword: String,
    },
    { timestamps: true }
);

PostSchema.virtual('postId').get(function () {
    return this._id.toHexString();
});

PostSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Post', PostSchema);