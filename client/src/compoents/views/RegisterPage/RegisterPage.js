import React, {useState} from 'react'
import {useDispatch} from 'react-redux';
import {registerUser} from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();
    
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Name, setName] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")


    const onEmailHandler = (event) => {//set 이메일을 이용해서 상태를 바꿀 수 있음
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }
    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); //이걸 안해주면 로그인 누르면 페이지가 새로고침됨, 이렇게 되어버리면 
        //원래 해야될 일이 있어야되는데 그걸 하는게 아니고 페이지가 새로고침되어서 뭘 할 수가 없음
        // 이걸 막으려고 eventpreventdefault를 하는거
        
        //지금 클라이언트단에 있는 이메일 패스워드 정보를 서버에다 줘야 하는거, 
        //서버에다 보내는거는 axios 사용
        if(Password !== ConfirmPassword){
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.")
        }

        let body ={
            email:Email,
            name:Name,
            password:Password
        }
        dispatch(registerUser(body))//로그인 유저라는 액션을 만들어야 함 이제 
            .then(response => {
                if(response.payload.success){
                    props.history.push("/login")
                } else{
                    alert("Failed to sign up")
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

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler}/>

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>

                <label>ConfrimPassword</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>

                <br />
                <button type="submit">
                    회원가입
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage)
