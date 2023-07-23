import request from '@commons/request.js'

export default {
  // 登录
  login: data => request({
    // url: 'logincheck2?tcYhzh=' + data.tcYhzh + '&tcYhmm=' + data.tcYhmm
    url: 'logincheck2?v=' + new Date().getTime(),
    method: 'get',
    params: data,
    loader: false
  }),
  getCode: data => request({
    // url: 'logincheck2?tcYhzh=' + data.tcYhzh + '&tcYhmm=' + data.tcYhmm
    url: 'system/getVerificationCode',
    // url: 'SecurityBackend/system/getVerificationCode',
    method: 'get',
    params: data
  }),

  sendDxCode: async data => {
    const result = await request({
      url: 'system/sendDxyzmTest',
      method: 'post',
      params: data
    })
    return result || {}
  }
  // sendDxCode: data => request({
  //   url: 'system/sendDxyzmTest',
  //   method: 'post',
  //   params: data
  // })
}
