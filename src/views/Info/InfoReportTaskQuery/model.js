import request from '@commons/request.js'

export default {
  // 获取任务列表
  getTaskList: async data => {
    const result = await request({
      url: 'rwfb/queryRwfbList',
      data
    })
    return result || {}
  },
  // 获取任务详情
  getTaskStatus: async data => {
    const result = await request({
      url: 'rwfb/queryRwztList',
      data
    })
    return result || {}
  },
  // 申请重填
  applyData: async data => {
    const result = await request({
      url: '/rwzt/sqct',
      data: {
        requestData: data
      }
    })
    return result || {}
  },
  // 查询是否已经填报
  queryRwzt: async data => {
    const result = await request({
      url: 'rwzt/queryRwztList',
      data
    })
    return result || {}
  },
}
