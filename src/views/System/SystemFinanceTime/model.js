import request from '@commons/request.js'

export default {
  getListData: async data => {
    const result = await request({
      url: '/system/getTimeSchedualList',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },
  addData: async data => {
    const result = await request({
      url: '/system/addTimeSchedual',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  updateData: async data => {
    const result = await request({
      url: '/system/updateTimeSchedual',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
}
