import request from '@commons/request.js'

export default {
  getList: async data => {
    const result = await request({
      url: '/trainingRecord/getList',
      data
    })
    return result || {}
  },
  delete: async data => {
    const result = await request({
      url: '/trainingRecord/delete',
      data
    })
    return result || {}
  },
  setBzw: async data => {
    const result = await request({
      url: '/trainingRecord/setBzw',
      data
    })
    return result || {}
  },
}
