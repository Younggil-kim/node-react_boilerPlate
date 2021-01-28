import {combineReducers} from 'redux';
import user from './user_reducer';
// import comment from './comment_reducer';
const rootReducer = combineReducers({
    //로그인기능 레지스터 기능 인증에 관한 기능을 만들거

    user
    // comment //기능이 많아질수록 쭉 늘어날것
})

export default rootReducer;