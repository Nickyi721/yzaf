import request from '@commons/request.js'

export default {
  getFwqyxDetail: async data => {
    const result = await request({
      url: '/xtfwqyxqk/getDetail',
      data: {
        isQuery: 1,
        requestData: {
          tnFwqyxqkid: data
        }
      }
    })
    return result || {}
  }
}
