const express = require("express");
const Post = require("../models/post"); //스키마 폴더 안에 post 스키마
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();



// 게시글 전체목록 조회 API 
router.get("/posts", async (req, res) => { 
    //get Method를 가진 post URL을 가진 json 데이터로 내보내는 API
    const { postDate } = req.body;

    const post = await Post.find({ postDate }).sort({ postDate: -1 }); //post라는 스키마에서 find, sort()날짜기준 내림차순 
    res.json({ //json형식으로 응답
        posts: post//원래는 json 형식으로 post:post 로 작성되어야한다. 그러나 key와 value가 같다면 약식이 가능하다. (객체 초기자)
    });
});

// 게시글 작성 API
router.post("/write", authMiddleware, async (req, res) => { 
    try {
        const { user } = res.locals;
        const { title, content, postDate } = req.body; // body 정보가져옴

        // 자동으로 postId를 넣는 라이브러리 설치 후 중복확인 절차 제거
        // isExist = await Post.find({ postId });
        // if (isExist.length) {
        //     return res.status(400).json({ success: false, errorMessage: "이미 있는 게시글입니다." });
        // }

        const createpost = await Post.create({ postId, nickname: user.nickname, title, content, postDate });

        res.json({ post: createpost });
    } catch (err) {
        console.log(err)
        res.status(400).send({
            errorMessage: "게시글 작성 에러",
        })
    };
});

// 게시글 상세 조회 API
router.get("/post/:postId", authMiddleware, async (req, res) => { 
    const { user } = res.locals;
    const { postId } = req.params;

    const [detail] = await Post.find({ postId: Number(postId) });
if(detail.nickname !== user.nickname){
    console.log("유효하지 않은 회원정보");
    res.status(400).redirect("/")
}
    res.json({ //json형식으로 상세 조회 응답
        detail, // detail이라는 Key에 json 데이터를 넣어서 응답을 준다.
    });
});


router.put("/post/:postId", authMiddleware, async (req, res) => { // 게시글 수정 API
    const { user } = res.locals;
    const { postId } = req.params;
    const { password, title, content } = req.body;
    const correctPw = await Post.findOne({user})
    if (password === correctPw.password) {
        const updatepost = await Post.updateOne({ postId: Number(postId) }, { $set: { title, content } });
        res.status(201).json({ post: updatepost })
    } else {
        return res.status(401).json({ success: false, errorMessage: "비밀번호 재확인." });
    };
});

router.delete("/post/:postId", authMiddleware, async (req, res) => { // 게시글 삭제 API
    const { user } = res.locals;
    const { postId } = req.params;
    const { password } = req.body;
    const correctPw = await Post.findOne({ user })
    if (password == correctPw.password) {
        const deletepost = await Post.deleteOne({ postId: Number(postId) });
        res.status(200).json({ post: deletepost })
    } else {
        return res.status(401).json({ success: false, errorMessage: "비밀번호 재확인." });
    };
});





router.get('/post/write', async (req, res) => {
    const post = ''; // write.ejs는 modify 부분과 같이 쓰므로,
    //새 글 쓰기 일 경우 !post 이 true 로 넘길 수 있도록 빈 스트링값 전달
    res.status(200).render('write', { post: post });
});
router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params; // localhost:3000/api/posts/1, 2, ... <- 여기서 req.params는 { postId : '1' }, postId = 1

    const post = await Post.findById(postId);
    const postAuthor = await User.findById(post.userId);
    const comments = await Comment.find({ postId: postId }).exec();
    

    const commentUserIds = comments.map(
        (commentAuthor) => commentAuthor.userId
    );
  
    const commentAuthorInfoById = await User.find({
        _id: { $in: commentUserIds },
    })
        .exec()
        .then((commentAuthor) =>
            commentAuthor.reduce(
                (prev, ca) => ({
                    ...prev,
                    [ca.userId]: ca,
                }),
                {}
            )
        );

    const postInfo = {
        postId: post._id,
        title: post.title,
        content: post.content,
        userId: postAuthor.userId,
        nickname: postAuthor.nickname,
        createdAt: post.createdAt,
    };

    const commentsInfo = comments.map((comment) => ({
        commentId: comment.commentId,
        content: comment.commentContent,
        userInfo: commentAuthorInfoById[comment.userId],
        createdAt: comment.createdAt,
    }));
    
   
    res.status(200).render('read', {
        post: postInfo,
        commentsInfo: commentsInfo,
    }); // read.ejs 의 내용 render, postId 값이 일치하는 post 내용 전달
});

module.exports = router; // app.js의 require()로 리턴. module.exports는 꼭 있어야함.