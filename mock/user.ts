/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-19 16:20:55
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-20 09:43:47
 * @FilePath: \jt-design\mock\user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//用户信息数据
//createUserList : 函数执行会返回一个数组
function createUserList(){
  return [
      {
          userId: 1,
          avatar:
              'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          username: 'admin',
          password: '111111',
          desc: '平台管理员',
          roles: ['平台管理员'],
          buttons: ['cuser.detail'],
          routes: ['home'],
          token: 'Admin Token',
      },
      {
          userId: 2,
          avatar:
              'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          username: 'system',
          password: '111111',
          desc: '系统管理员',
          roles: ['系统管理员'],
          buttons: ['cuser.detail', 'cuser.user'],
          routes: ['home'],
          token: 'System Token',
      },
  ]
}

export default [
  // 用户登录接口
  {
    url: '/api/user/login',//请求地址
    method: 'post',//请求方式
    response: ({ body }) => {
        //获取请求体携带过来的用户名与密码
        const { username, password } = body;
        //调用获取用户信息函数,用于判断是否有此用户
        const checkUser = createUserList().find(
            (item) => item.username === username && item.password === password,
        )
        //没有用户返回失败信息
        if (!checkUser) {
            return { code: 201, data: { message: '账号或者密码不正确' } }
        }
        //如果有返回成功信息
        const { token } = checkUser
        return { code: 200, data: { token } }
    },
},
// 获取用户信息
{
    url: '/api/user/info',
    method: 'get',
    response: (request) => {
        //获取请求头携带token
        const token = request.headers.token;
        //查看用户信息是否包含有次token用户
        const checkUser = createUserList().find((item) => item.token === token)
        //没有返回失败的信息
        if (!checkUser) {
            return { code: 201, data: { message: '获取用户信息失败' } }
        }
        //如果有返回成功信息
        return { code: 200, data: {checkUser} }
    },
},
]