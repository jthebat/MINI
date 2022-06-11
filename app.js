const express = require("express"); //express 모듈 불러오기
const app = express();
const connect = require("./models"); // index.js 파일 연결해서 mongoDB 연결

const port = 8080;

connect(); //mongoDB 연결 실행

const postRouter = require("./routes/post"); // require 함수로 post 모듈(board.js)을 가지고옴.

const userRouter = require("./routes/user"); // require 함수로 user라우터 모듈(user.js)을 가지고옴.

const commentRouter = require("./routes/comment"); // require 함수로 comment라우터 모듈(user.js)을 가지고옴.

// 접근한 URL과 시간을 표시해주는 로그 미들웨어
const requestMiddleware = (req, res, next) => {
  console.log("Request URL:", req.originalUrl, "-", new Date());
  next();
};

// app.use(express.static('static')); //프론트엔드 static 폴더 연결

app.use(express.json()); // json 미들웨어 실행

app.use(express.urlencoded()); // url 인코더 미들웨어 실행

app.use(requestMiddleware); // 접근한 URL과 시간 로그 미들웨어 실행

app.use("/api", [postRouter, commentRouter, userRouter]); // /api라는 url 요청시 라우터 미들웨어 실행.

//루트 디렉토리 http://localhost:8080
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.get("/", async (req, res) => {
//   //console.log("call되면 보여줘"); // '/'로 이동할때마다 들어오는거구나
//   res.status(200).render("index");
// });

app.listen(port, () => {
  console.log(port, "번 포트로 서버가 열렸어요!");
});

//------------------------------------------
