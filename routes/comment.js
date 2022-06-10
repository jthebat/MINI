const express = require("express");
const Comment = require("../models/comment");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

//댓글 목록 조회
router.get("/comment/:postId", async (req, res) => {
    const { postId } = req.params;

    const comment = await Comment.find({ postId: postId }).sort("-commentId"); // 댓글 작성시간 순으로 정렬

    res.json({ comment: comment });
});

//댓글 작성
router.post("/comment", authMiddleware, async (req, res) => {
    try {
        const { user } = res.locals;
        const {postId, comment} = req.body;
        await Comment.create({
            commentId, postId, comment, nickname: user.nickname,
        });
        res.send({ result: "success" });
    } catch (err) {
        console.log(err)
        res.redirect("/")
    }
});

//댓글 수정
router.patch("/comment/:commentId", authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { user } = res.locals;
    const { comment, nickname } = req.body;
    console.log(comment, user.nickname)

    if (nickname === user.nickname) {
        await Comment.updateOne({ commentId: commentId }, { $set: { comment: comment } }); //db의 필드값: req.body
        res.send({ result: "success" });
    } else {
        res.send({ result: "fail" });
    }
});

//댓글 삭제
router.delete("/comment/:commentId", authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { user } = res.locals;
    const { nickname } = req.body

    if (nickname === user.nickname) {
        await Comment.deleteOne({ commentId: commentId })
        res.send({ result: "success" })
    } else {
        res.send({ result: "fail" })
    }
});

module.exports = router;