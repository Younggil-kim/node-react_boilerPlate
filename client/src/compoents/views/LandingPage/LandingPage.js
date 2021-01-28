import React,{ useEffect} from 'react'
import axios from 'axios';
import {withRouter} from 'react-router-dom';
function LandingPage(props) {

    useEffect(() => {
        axios.get('/api/hello')
        .then(response =>{console.log(response.data)})
    }, [])
    // 랜딩페이지 들어오자마자 유즈 이펙트 코드 실행하는거
    // get리퀘스트를 서버에다가 보내는거, and포인트는 api hello
    // 보낸다음 서버에서 돌아오는 response를 콘솔창에 보여주는거 
    // 이렇게 그냥 보내면 서버는 5천번포트, 클라는 3천번포트라서 에러가남
    // 두 개의 다른 포트를 가지고있는 서버는 아무 설정없이 request를 보낼 수 없어
    // Cor정책에 의해서 막혀버리게 됨, 보안을 위해서야
    // 다른 곳에서 서버에 뭘 보내고 하면 보안 이슈가 생기니까
    // 해결 방법은 여러 방법이 있는데 우리느 프록시를 이용할거

    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {
                if(response.data.success){
                    props.history.push("/login")
                } else {
                    alert("로그아웃 하는데 실패하였습니다.")
                }
            })
    }
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>
            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default withRouter(LandingPage)