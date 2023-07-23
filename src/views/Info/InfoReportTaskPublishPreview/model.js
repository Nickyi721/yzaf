import request from '@commons/request.js'

export default {
  // 获取任务列表
  getTaskList: async data => {
    const result = await request({
      url: 'rwfb/getDwByRwid',
      data
    })
    return result || {}
  },
  updateTaskList: async data => {
    const result = await request({
      url: 'rwfb/updateTime',
      data
    })
    return result || {}
  }

}
