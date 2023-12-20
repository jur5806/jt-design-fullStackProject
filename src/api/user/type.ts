//登录接口需要携带参数ts类型
export interface loginForm{
  username: string,
  password: string,
}
interface dataType{
  token: string
}
//登录接口返回的数据类型
export interface loginResponseDate{
  code: number,
  data: dataType,
}

interface user{
  checkUser: any
}

//服务器返回用户信息相关数据类型
export interface userResponseDate{
  code: number,
  data:user
}