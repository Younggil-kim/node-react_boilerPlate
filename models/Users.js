const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//salt를 이용해서 비밀번호를 암호화해야함
const saltRounds = 10//10자리인 솔트를 만들어서 이걸 이용해서 암호화 한다는 소리

const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //빈칸을 없애주는 역할을 trim이 함, 만약 younggil kim@naver.com 이런식으로 쳤으면, 스페이스바를 지워주는 역할
        unique: 1
    },
    password: {
        type: String,
        maxlength: 100
    },
    lastname:{
        type: String,
        maxlength: 50
    },
    role: {//롤을 주는 이유는 일반유저 , 관리자 다 될 수 있으니, 관리자는 일반유저를 관리할 수 있고 하니까 롤은 넘버로 함, 넘버가 1이면 관리자 0이면 일반유저 이런식
        type: String,
        default: 0
    },
    image: String,
    token: {//토큰은 유효성 검사를 하는거
        type: String
    },
    tokenExp: {//유효기간, 토큰이 사용 될 수 있는 기간을 주는거 
        type: Number
    }
})// 이 스키마를 모델로 감싸야함 
userSchema.pre('save', function(next){
    //비번 암호화
    var user = this;//유저 스키마를 가리킴

    if(user.isModified('password')){//패스워드에 변경이 있을때만 암호화를 해 준다
            bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err)//넥스트 하면 레지스터 단으로 보내버림
        //에러가 아닌 경우
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err)//에러 나면 돌려보내고 해쉬는 이제 암호화된 비밀번호임
            user.password = hash //유저 패스워드를 해쉬로 교체
            next()
        })
    })
    
    } else{
        next()
    }

})//유저 모델의 정보를 저장하기 전에, fun을 실행함 이게 끝나면 next로 보내버림 레지스터로
userSchema.methods.comparePassword = function(plainPassword, cb ){
    //비밀번호 비교시, 플레인 패스워드를 암호화해서 암호화한게 맞는지 체크해줘야함
    // 내가 암호화된 비밀번호를 복호화 할 순 없음
    
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) 
            return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    //jsonwebtoken 이용해서 토큰 생성
    var user = this;
    var token = jwt.sign(user._id.toHexString(), "secretToken")
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    //토큰을 디코드 한다
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
        //디코드 된게 결국 유저아이디
        user.findOne({"_id":decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User',userSchema);

module.exports = {User} //이 모델을 다른 파일에서도 쓰고 싶어서, 모듈화 시킨거, 