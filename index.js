const express = require('express')//express 모듈을 가져옴
const app = express()//새 app을 만들고
const port = 5000//포트 번호 5천번을 백 서버로 둠
//모델은 스키마를 감싸주기 위한것
//스키마는 뭐냐면, 어떤 상품에 관련된 글을 작성을 하면 글을 작성한 사람이 누구인지 써야함
//작성시에 포스트에 이름이 뭔지, 타입이 뭔지 하나하나 지정해 줄 수 있는게, 스키마임

const {User} = require("./models/Users");
const bodyParser = require('body-parser');
//바디파서는 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해주는것
// 그래서 이 부분은 application/x-www-form-urlencoded
//라고 되어 있는 부분을 가져오는 부분
app.use(bodyParser.urlencoded({extended: true}));
//이 아래 부분은 application/json 타입으로 되어있는것을 분석해서 가져오게 할 수 있게 이 두 줄을 넣은 것
app.use(bodyParser.json());


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
//클라이언트에서 보내주는 이름, 이메일 비밀번호 정보들을 가져오면 그것들을 데이터베이스에 넣어주는 역할
app.post('/register',(req, res) => {
	const user = new User(req.body)//req.body 안에는 json형식으로 id : "gom991" 이런 식으로 들어있음, 이렇게 들어있게 할 수 있는 이유가 바디파서가 있어서 그럼
	user.save((err, userInfo) => {
    	if(err) return res.json({success: false, err})//실패했으면 에러가 났다는걸 json형식으로 콜백해줌
    	return res.status(200).json({//status 200은 성공했다는 표시임
      	success: true
    })
  })//자 이렇게 되면 회원가입을 위한 라우트는 완성 

})
//body parser를 받고, 이거 왜 받는지 검색해보자
//post Man 을 받아야함 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)//5000번 포트에서 앱 실행
})