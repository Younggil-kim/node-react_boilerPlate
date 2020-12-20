const express = require('express')//express 모듈을 가져옴
const app = express()//새 app을 만들고
const port = 5000//포트 번호 5천번을 백 서버로 둠
//모델은 스키마를 감싸주기 위한것
//스키마는 뭐냐면, 어떤 상품에 관련된 글을 작성을 하면 글을 작성한 사람이 누구인지 써야함
//작성시에 포스트에 이름이 뭔지, 타입이 뭔지 하나하나 지정해 줄 수 있는게, 스키마임

 
const mongoose = require('mongoose')//몽구스는 몽고DB를 좀 사용하기 편하게 해주기 위한 도구 같은거 쉽게생각하면
mongoose.connect('mongodb+srv://gom991:00dudrlf!!@boilerplate.ruzfd.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    //이걸 안쓰면 에러가 뜸
}).then(() => console.log('MongoDB connected...'))
 .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!~안녕하세요')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)//5000번 포트에서 앱 실행
})