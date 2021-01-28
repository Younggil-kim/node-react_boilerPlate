import React,{useEffect} from 'react';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {auth} from '../_actions/user_action';

export default function(SpecificComponent, option, adminRoute = null){

    //null => 아무나 출입 가능한 페이지
    //true => 로그인한 유저만 출입이 가능
    //false => 로그인한 유저는 출입 불가능

    function AuthenticationCheck(props){

        const dispatch = useDispatch();

        useEffect(() => {
            
            dispatch(auth()).then(response => {
            //분기 처리를 여기서 해야함, 로그인한 유저가 로그인페이지 간다던가 하는
            if(!response.payload.isAuth){
                //로그인 하지 않음
                //위에 옵션이 트루면 로그인한 유저만 출입가능
                if(option){
                    props.history.push('/login')
                }
            }else {
                //로그인 한 상태
                if(adminRoute && !response.payload.isAdmin){
                    props.history.push('/')
                }else {
                    if(option === false){
                        //로그인한 유저가 출입불가능한 곳 가는 경우
                        props.history.push('/')
                    }
                }
            }
            })
        }, [])
        return(
            <SpecificComponent />
        )

    }


    return AuthenticationCheck
}