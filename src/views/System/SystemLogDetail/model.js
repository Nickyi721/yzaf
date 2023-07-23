import request from '@commons/request.js'

export default {
  getLogDetail: async data => {
    const result = await request({
      url: '/xtrz/getDetail',
      data: {
        isQuery: 1,
        requestData: {
          tnId: data
        }
      }
    })
    return result || {}
  }
}
