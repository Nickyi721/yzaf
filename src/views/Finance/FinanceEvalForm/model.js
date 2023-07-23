import request from '@commons/request.js'

export default {
  getEvalStatus: async data => {
    const result = await request({
      url: 'finSecEva/getFormsScoNStatusList',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
}
