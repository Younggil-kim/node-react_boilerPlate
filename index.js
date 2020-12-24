const express = require('express')//express 모듈을 가져옴
const app = express()//새 app을 만들고
const port = 5000//포트 번호 5천번을 백 서버로 둠
//모델은 스키마를 감싸주기 위한것
//스키마는 뭐냐면, 어떤 상품에 관련된 글을 작성을 하면 글을 작성한 사람이 누구인지 써야함
//작성시에 포스트에 이름이 뭔지, 타입이 뭔지 하나하나 지정해 줄 수 있는게, 스키마임
const {auth} = require("./middleware/auth");
const {User} = require("./models/Users");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//바디파서는 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해주는것
// 그래서 이 부분은 application/x-www-form-urlencoded
//라고 되어 있는 부분을 가져오는 부분
app.use(bodyParser.urlencoded({extended: true}));
//이 아래 부분은 application/json 타입으로 되어있는것을 분석해서 가져오게 할 수 있게 이 두 줄을 넣은 것
app.use(bodyParser.json());
app.use(cookieParser());

const config = require('./config/key');

const mongoose = require('mongoose')//몽구스는 몽고DB를 좀 사용하기 편하게 해주기 위한 도구 같은거 쉽게생각하면
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    //이걸 안쓰면 에러가 뜸
}).then(() => console.log('MongoDB connected...'))
 .catch(err => console.log(err))

app.get('/', (req, res) => {
	res.send('Hello World!~안녕하세요, 잠이 와요')
})

app.post('/api/users/register',(req, res) => {
	const user = new User(req.body)//req.body 안에는 json형식으로 id : "gom991" 이런 식으로 들어있음, 이렇게 들어있게 할 수 있는 이유가 바디파서가 있어서 그럼
	user.save((err, userInfo) => {
    	if(err) return res.json({success: false, err})//실패했으면 에러가 났다는걸 json형식으로 콜백해줌
    	return res.status(200).json({//status 200은 성공했다는 표시임
      	success: true
    })
  })//자 이렇게 되면 회원가입을 위한 라우트는 완성 

})

//클라이언트에서 보내주는 이름, 이메일 비밀번호 정보들을 가져오면 그것들을 데이터베이스에 넣어주는 역할
app.post('/api/users/login', (req, res) => {
	//1. 요청된 이메일이 db안에 있는지 찾기
	User.findOne({ email: req.body.email}, (err, user) => {
		if(!user){
			return res.json({
				loginSuccess: false,
				message: "이메일이 없습니다."
			})
		}

		//유저가 있으면 비밀번호가 맞는지 확인
		user.comparePassword( req.body.password, (err, isMatch) => {
			if(!isMatch)
				return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})
			
			//비밀번호 맞으면 토큰 생성
			user.generateToken((err, user) => {
				if(err) return res.status(400).send(err);
				//토큰을 저장한다. 어디? 쿠키, 로컬스토리지 다 가능
				res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id})
			})
		})
	})
})
//auth라는 라우터 만들기
// 사이트를 들어가면 많은 페이지가 있는데, 로그인된 유저만 접근가능한 페이지가 있어, 이런거 있을때, 로그인 된 유저만 글을 쓸 수 있기도 하고
// 관리자만 이용 할 수 있는 기능도 있는데, 그걸 하나하나 체크해 주기 위해서 auth 기능을 만들거
// 어떻게 만드냐면, 우리가 토큰을 만든다음, 토큰을 유저 정보에다 넣어줬어 쿠키에다가 넣었어 클라이언트에는 쿠키, 서버에는 유저디비에 넣었단 말이지
// 이 두가지를 이용해서 이 두가지 토큰이 맞는지 계속 체크 해 주는거, 어떤 유저가 A페이지에서 B페이지로 갔을 때, B페이지로 갈 수 있는 사람인지 확인하기 위해
// 먼저 클라이언트에서 서버에 쿠키에 담겨져 있는 토큰을 전달을 함, 그러면 서버쪽에서 쿠키를 전달받을 때( 클라이언트에서 쿠키를 줄 떄)
// 쿠키가 인코드 되어있는 상태니까 디코드를 하면 유저 아이디가 나온단말야(시크릿 토큰 + 유저아이디가 토큰이니까)
// 즉 디코딩을 하면 유저아이디가 나와, 그래서 유저 아이디를 가진 유저디비에 토큰이 있으면 인증이 맞는거고, 토큰이 없거나 다르면 이 유저가 아니니까 제한한다
// 인증과 관련된 부분은 상당히 복잡함, 로그인 라우트와 마찬가지로 복잡한 부분은 계속 한번 돌아볼것

app.get('/api/users/auth', auth ,(req, res) =>{
	//여기까지 미들웨어를 통과해 왔다는 얘기는 authentication이 True라는 말
	// 결국 트루라는걸 클라이언트에 정보를 전달해줘야해
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image
	})

})//auth라는 미드웨어, 엔드포인트에 리퀘스트를 받은 다음 콜백하기 전에 중간에서 뭘 해주는거

//로그아웃 라우트 만들기
//로그아웃 시 서버 디비에 ㅌ토큰을 지워버리면 인증이 안되어서 로그아웃 됨
app.get('/api/users/logout', auth, (req, res) => {
	//로그아웃 하려는 유저를 디비에서 찾는다
	User.findOneAndUpdate({ _id: req.user._id },//auth 미들웨어에서 넣어줬으니까 여기서 가져오면됨
		{ token: ""}//토큰을 지워줌 
		,(err, user) => {
			if(err) return res.json({ success:false, err});
			return res.status(200).send({
				success:true
			})
		})
})






//body parser를 받고, 이거 왜 받는지 검색해보자
//post Man 을 받아야함 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)//5000번 포트에서 앱 실행
})