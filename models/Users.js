const mongoose = require('mongoose');

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
        maxlength: 50
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
});// 이 스키마를 모델로 감싸야함 

const User = mongoose.model('User',userSchema);

module.exports = {User} //이 모델을 다른 파일에서도 쓰고 싶어서, 모듈화 시킨거, 