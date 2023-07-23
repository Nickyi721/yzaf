import request from '@commons/request.js'

export default {
  getQrcodeList: async data => {
    const result = await request({
      url: '/qrcode/getQrcodeList',
      data: data
    })
    return result || {}
  },
}