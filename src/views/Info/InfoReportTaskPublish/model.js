import request from '@commons/request.js'

export default {
  // 获取任务列表
  getTaskList: async data => {
    const result = await request({
      url: 'rwfb/getTaskToList',
      data
    })
    return result || {}
  },
  // 删除指定任务
  deleteTaskList: async data => {
    const result = await request({
      url: 'rwfb/deleteFormTaskTo',
      data
    })
    return result || {}
  },

}
