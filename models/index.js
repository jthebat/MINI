const mongoose = require("mongoose"); //몽구스 연결

const connect = () => { //mongoose 연결
    mongoose
        .connect("mongodb+srv://test:sparta@cluster0.l2ux3.mongodb.net/MINI?retryWrites=true&w=majority", {
            ignoreUndefined: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .catch((err) => {
            // undefined값은 무시함. 상세조회API에 Query String 필터링 기능 구현을 위해 작성
            console.log(err);
        });

    mongoose.connection.on("error", err => {
        console.error("mongoDB 연결 에러", err);
    });
};

module.exports = connect; //app.js로 보냄


const dotenv = require("dotenv");

mongoose.connect("mongodb+srv://test:sparta@cluster0.l2ux3.mongodb.net/MINI?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ignoreUndefined: true,
}).catch((err) => {
    console.error(err);
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

dotenv.config();
