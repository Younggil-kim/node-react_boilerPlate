import axios from 'axios'
import { set } from 'mongoose'
import React, {useState} from 'react'
import {useDispatch} from 'react-redux'
import {loginUser} from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';
function LoginPage(props) {

    // state를 먼저 만들어야함, 이메일을 위한 상태, 비번을 위한 상태
    const dispatch = useDispatch();
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {//set 이메일을 이용해서 상태를 바꿀 수 있음
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault(); //이걸 안해주면 로그인 누르면 페이지가 새로고침됨, 이렇게 되어버리면 
        //원래 해야될 일이 있어야되는데 그걸 하는게 아니고 페이지가 새로고침되어서 뭘 할 수가 없음
        // 이걸 막으려고 eventpreventdefault를 하는거
        
        //지금 클라이언트단에 있는 이메일 패스워드 정보를 서버에다 줘야 하는거, 
        //서버에다 보내는거는 axios 사용

        let body ={
            email:Email,
            password:Password
        }
        dispatch(loginUser(body))//로그인 유저라는 액션을 만들어야 함 이제 
            .then(response => {
                if(response.payload.loginSuccess){
                    props.history.push('/')
                }else{
                    alert("Error")
                }
            })

    }
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style= {{ display: 'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>

                <br />
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default withRouter(LoginPage)