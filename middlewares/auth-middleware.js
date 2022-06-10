const jwt =require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req,res, next) => {    
    const {authorization} = req.headers;  //authorization 은 프론트와 맞춘 형식 프론트에서느 대문자였지만 여기서는 자동으로 소문자로 변환 된다.
      
    const [tokenType,tokenValue] = authorization.split(' ');
    
     if(tokenType !== 'Bearer'){
         res.status(401).send({
             errorMessage: '로그인 후 사용하세요',
         });
         return;
    }
 
    try{
        
        const {userId} = jwt.verify(tokenValue,process.env.JWT_SECRET);
        //console.log(userId);
         User.findOne({"_id": userId }).exec().then((user) => {
            res.locals.user = user;            
            next()
        });

         //아래부분이 오류의 원인이였다. 나오는 값확인해보자
         /*
         User.findById(userId).exec().then((user) => { //async 함수가 아니기 떄문에 await을 사용할 수 없다 promis then 구문을 쓰자
             
             res.locals.user = user;  //express에서 locals이라는 우리가 사용할 수 있는 유틸리티 공간을 제공해서 우리 마음대로 쓸 수 있다. 우리는 여기에 사용자 정보를 담아 넘긴다. //res.locals 는 객체
             next();  //middleware에서는 next가 반드시 호출돼야 한다 만약에 next가 호출되지 않으면 middleware레벨에서 예외처리에 걸려서 그뒤의 미들웨어까지 연결이 안된다
         }); 
        */

    }catch (error){
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        });
        return;

    }
   
};