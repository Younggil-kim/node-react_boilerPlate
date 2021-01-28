const {User} = require('../models/Users');

let auth = (req, res, next) => {

    //여기서 인증처리를 할거, 토큰이 맞는지 아닌지 그런거

    //1. 제일 먼저 클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;
    //2. 토큰을 복호화 한 다음 유저를 찾는다
    User.findByToken(token, (err, user) => {
        if(err) throw err;//유저가 없으면 에러
        if(!user) return res.json({ isAuth: false, error: true})

        req.token = token;//리퀘스트에 토큰, 유저 넣어주는 이유는, 넣어줌으로 인해 auth에서 유저 정보를 가질 수 있음 req.user하면,
        req.user = user;//이거를 이렇게 넣어주면 index.js에서 auth루트에 가면 이걸 사용할 수 있어
        next();//넥스트를 하는 이유는 미들웨어이기 떄문에 미들웨어에서 계속 갈 수 있도록
    })
    //3. 유저가 있으면 인증 O 유저가 없으면 인증 X

}

module.exports = {auth};