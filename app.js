const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment")

const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authMiddleware = require("./middlewares/auth-middleware");

const port = 8080;

mongoose.connect("mongodb+srv://test:sparta@cluster0.l2ux3.mongodb.net/simple_blog?retryWrites=true&w=majority", {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    ignoreUndefined: true,
}).catch((err) => {
    console.error(err);
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

dotenv.config();
const app = express();
const router = express.Router();


/**
 * 전체 게시글 불러오기 API. index.ejs > getArticles()
 */
/*
router.get('/posts', async (req, res) => {
    // [{ post의 내용. _id: ..., title: ..., content: ... }, { }, { }]
        
    const posts = await Post.find().sort({ createdAt: 'desc' }).exec();
    //console.log("posts",posts);    
    // userId만 추출. ['userId1', 'userId2', 'userId3', ..]
    const userIds = posts.map((author) => author.userId);
    
    // $in : 비교 연산자. 주어진 배열(userIds) 안에 속하는 값
    const userInfoById = await User.find({
        _id: { $in: userIds },
    })
        .exec()
        .then((user) =>
          user.reduce(
                (prev, a) => ({
                    ...prev,   
                    [a.userId]: a, 
                 }),
                    {} 
                    )
                    ); 
    
    res.send({
       posts: posts.map((a) => ({
            postId: a.postId,
            title: a.title,
            content: a.content,
            createdAt: a.createdAt,
            userInfo: userInfoById[a.userId],
        })),
    });
});
*/
/**
 * 글쓰기 접근 시 사용자 정보를 가져가기 위한 API write.ejs > getAuthorInfo()
 */
/*
router.get('/posts/write', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    //console.log("here",res.locals.user);
    
    const userInfo = await User.findById(userId);
   // console.log("here",authorInfo);
    res.status(200).send({
        user: {
            userId: userId,
            nickname: userInfo.nickname,
        },
    });
});
*/
/**
 * 글 생성, 입력 API write.ejs > writeArticle()
 */
/*
router.post('/posts/write', authMiddleware, async (req, res) => {
    const { userId, postPassword, title, content } = req.body;
    // console.log(req.body);

    // const postArticle = await Post.create({ postId, title, content, userId, nickname, postPassword });
    const postArticle = await Post.create({
        userId,
        postPassword,
        title,
        content,
    });
    
    res.status(201).json({ result: 'success', msg: '글이 등록되었습니다.' });
});
*/
/**
 * 코멘트 입력 생성, 입력 API  read.ejs > postComment()
 */
/*
router.post('/comments/write', authMiddleware, async (req, res) => {
    const { userId, postId, commentContent } = req.body;
    // console.log(req.body);

    const postArticle = await Comment.create({
        userId,
        postId,
        commentContent,
    });
  
    res.status(201).json({ result: 'success', msg: '댓글이 등록되었습니다.' });
});
*/

 //=====================Question  app.get router.patch  render 와의 세트 ? rendering 에 대해 생각해보자 
 /*
app.get('/posts/:postId/modify', async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);
   
    res.status(200).render('write', { post: post });
});
*/
/**
 *블로그 글 수정 API write.ejs > modifyArticle()
 */
/*
router.patch('/posts/:postId/modify',authMiddleware,async (req, res) => {
        const { title, content, userId, postPassword, postId } = req.body;
        const post = await Post.findById(postId);
        // console.log(post.postPassword);
        // console.log(postPassword);
        if (post.postPassword !== postPassword) {
            res.status(400).json({
                result: 'error',
                msg: '비밀번호가 일치하지 않아요..!',
            }); 
        } else {
            const modifyArticle = await Post.findByIdAndUpdate(postId, {
                $set: { title: title, content: content },
            });
            res.status(201).json({
                result: 'success',
                msg: '글이 수정되었습니다.',
            });
        }
    }
);
*/
/**
 *블로그 글 삭제 API write.ejs > deleteArticle()
 */
/*
router.delete('/posts/:postId/modify', authMiddleware, async (req, res) => {
        const { postPassword, postId } = req.body;
        const existsPost = await Post.findById(postId);
       
        if (existsPost) {
            // existsPost 이 존재하는 경우 = 쿼리 결과가 있는 경우
            if (existsPost.postPassword !== postPassword) {
                // 글 지우기 전 입력받은 비밀번호 체크
                res.status(400).json({
                    result: 'error',
                    msg: '비밀번호가 일치하지 않네요.',
                }); 
            } else {
                //console.log("댓글목록",existsComments);
                await Comment.deleteMany({ postId: postId });
                // console.log("댓글목록 삭제 실행 후",existsComments);
                await Post.findByIdAndDelete(postId); // postId 일치하는 것으로 삭제
                res.status(200).json({
                    result: 'success',
                    msg: '글이 삭제되었습니다.',
                });
            }
        } else {
            // 올 일은 없지만, id값으로 찾아진게 없다는 것은 멀티 세션으로 같은 글을 동시에 지우려고 했을때?---???
            res.status(400).json({
                result: 'error',
                msg: '게시글이 이미 삭제되었습니다.',
            });
        }
    }
);
*/
/**
 *코멘트 수정 API read.ejs > modifyComment()
 */
/*
router.patch('/comments/:commentId/modify', authMiddleware, async (req, res) => {
        const { commentId, postId, modifiedCommentContent } = req.body;
      
        const comment = await Comment.findById(commentId);
      
        // res.status(400).json({'result': 'error', 'msg': '비밀번호가 일치하지 않아요..!'}) // 이거 대체 뭘로 줌? response? error?
        if (comment) {
            const modifiedComment = await Comment.findByIdAndUpdate(commentId, {
                $set: { commentContent: modifiedCommentContent },
            });
            res.status(201).json({
                result: 'success',
                msg: '댓글이 수정되었습니다.',
            });
        } else {
            res.status(400).json({
                result: 'error',
                msg: '댓글 수정에 실패했습니다..',
            });
        }
    }
);
*/
/**
 *코멘트 삭제 API read.ejs > deleteComment()
 */
/*
router.delete('/comments/:commentId/modify',authMiddleware, async (req, res) => {
        // console.log("delete router comments 들어옴");
        const { commentId } = req.body;
        // console.log(req.body);
        // console.log(commentId);
        const existsComment = await Comment.findById(commentId);
        // console.log(existsComment);

        if (existsComment) {
           
            await Comment.findByIdAndDelete(commentId); // commentId 일치하는 것으로 삭제
            res.status(200).json({
                result: 'success',
                msg: '코멘트가 삭제되었습니다.',
            });
        } else {
            // 올 일은 없지만, id값으로 찾아진게 없다는 것은 멀티 세션으로 같은 글을 동시에 지우려고 했을때?
            res.status(400).json({
                result: 'error',
                msg: '해당 코멘트는 이미 삭제되었습니다.',
            });
        }
    }
);
*/
/**
 * 회원가입 API.
 * 특정 pattern을 미리 정규표현식으로 정의하여, 변수로 선언해둔다.
 * postUserSchema 는 nickname, password, confirmPassword에 대해 Joi 라이브러리를 통해 조건을 명시함.
 */

 const nickname_pattern = /[a-zA-Z0-9]/; // 닉네임은 알파벳 대소문자 (a~z, A~Z), 숫자(0~9) 
 const postUsersSchema = Joi.object({
    
     nickname: Joi.string()
         .min(3)
         .pattern(new RegExp(nickname_pattern))
         .required(),
     password: Joi.string().min(4).required(),
     confirmPassword: Joi.string().required(),
 });

router.post("/users", async (req,res) => {

    try{
        const { nickname, password, confirmPassword} = await postUsersSchema.validateAsync(req.body);
        
        if(password.includes(nickname)){            
            res.status(400).send({    //상태코드가 400보다 작은 것은 client는 성공이라 인식 400(bad request)
                errorMessage: "닉네임이 패스워드에 포함되어 있습니다!",
            });
            return;
        }

        if(password !== confirmPassword){
            res.status(400).send({    //상태코드가 400보다 작은 것은 client는 성공이라 인식 400(bad request)
                errorMessage: "패스워드가 패스워드 확인란과 일치하지 않습니다.",
            });
            return;
        }
        const existUsers = await User.find({
            nickname
        });
        if(existUsers.length){
            res.status(400).send({
                errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다."
            });
            return;
        }
        const user = new User({ nickname, password });
        await user.save();

        res.status(201).send({});

    }catch(err){
        console.log(err);
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
        });

    }
    
});

/**
 *로그인 API 
 */
router.post("/auth", async(req,res)=>{
    try{

        const { user_id,password } = req.body;

        const user = await User.findOne({user_id,password}).exec();

        if(!user){
            res.status(401).send({ //401 인증실패 상태코드
                    errorMessage: "비밀번호 또는 아이디를 확인해보세요",
            });
            return;
        }
       // console.log("key",process.env.JWT_SECRET);
        const token = jwt.sign({userId: user.userId}, process.env.JWT_SECRET);
        //console.log("token",token);

        res.send({
                token,
        });

    }catch(err){
         console.log(err);
         res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
        });
    }    
});

//여기가 필요한가 ? 여기가 없으면 로그인 이후 로그인상태가 유지 안된다... ? 이유는 ?
//let cnt = 0;
router.get("/users/me",authMiddleware, async (req,res)=>{  // "/users/me" 경로로 들어오는 경우 authMiddleware가 붙는다
    const {user} = res.locals;
    //cnt++;
    //console.log("/users/me 호출테스트",user,cnt);
    res.send({
        user: {  
            userId: user.userId,          
            nickname: user.nickname,
        },
    });

});

app.get('/', async (req, res) => {
    //console.log("call되면 보여줘"); // '/'로 이동할때마다 들어오는거구나
    res.status(200).render('index');
});
app.get('/login', async (req, res) => {
    res.status(200).render('login');
});
app.get('/posts/write', async (req, res) => {
    const post = ''; // write.ejs는 modify 부분과 같이 쓰므로,
    //새 글 쓰기 일 경우 !post 이 true 로 넘길 수 있도록 빈 스트링값 전달
    res.status(200).render('write', { post: post });
});


app.get('/posts/:postId', async (req, res) => {
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

app.get('/posts/:postId/modify', async (req, res) => {
    res.status(200).render('read');
});


app.use("/api", express.urlencoded({ extended: false }), router);
//app.use(express.static("assets"));
app.set('view engine', 'ejs'); // ejs 사용을 위해 view engine 에 ejs set
app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
  console.log("port :",port,"로 서버가 요청을 받을 준비가 됐어요");

});


