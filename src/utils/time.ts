/*
 * @Author: jt 2602818429@qq.com
 * @Date: 2023-12-21 12:06:07
 * @LastEditors: jt 2602818429@qq.com
 * @LastEditTime: 2023-12-21 12:06:19
 * @FilePath: \jt-design\src\utils\time.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//封装一个函数：获取判断当前是上午还是下午
export const getTime = ()=>{
  let message = '';
  let hours = new Date().getHours();
  if(hours <= 9){
    message = '早上'
  }else if(hours <= 12){
    message = '上午'
  }else if(hours <= 18){
    message = '下午'
  }else{
    message = '晚上'
  }
  return message;
}