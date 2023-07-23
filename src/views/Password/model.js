import request from '@commons/request.js'
// import Mock from 'mockjs'
// import Config from '@/commons/config.js'

export default {
  // 修改密码
  // alterPwd: data => request({
  //   url: 'finSecEva/getEvaFormParamList',
  //   data: data
  // })
  alterPwd: data => request({
    url: 'system/modifyPassword',
    data: data
  })
}
