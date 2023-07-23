import request from '@commons/request.js'

export default {
  getSjscDetail: async data => {
    const result = await request({
      url: '/xtsjsc/getDetail',
      data: {
        isQuery: 1,
        requestData: {
          tnSjscid: data
        }
      }
    })
    return result || {}
  }
}
