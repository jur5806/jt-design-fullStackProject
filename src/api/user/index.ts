//统一管理咱们项目用户相关接口
import request from '@/utils/request';
import type { loginForm,loginResponseDate,userResponseDate} from './type';

enum API{
  LOGIN_URL="/api/user/login",
  USERINFO_URL="/api/user/info",
}

//暴露请求函数
//登录接口方法
export const reqLogin = (data: loginForm) => request.post<any,loginResponseDate>(API.LOGIN_URL, data);

//获取用户信息
export const reqUserInfo = () => request.get<any,userResponseDate>(API.USERINFO_URL);