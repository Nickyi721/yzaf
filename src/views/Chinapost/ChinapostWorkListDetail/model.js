import request from '@commons/request.js'

export default {
  // 获取年度重点工作详情
  getDetail: async data => {
    const result = await request({
      url: 'dailyWork/getYearBaseWorkDetail',
      data
    })
    return result || {}
  },
  // 新增工作进展
  addYearWorkPast: async data => {
    const result = await request({
      url: 'dailyWork/addYearBaseWorkPast',
      data
    })
    return result || {}
  },
  // 新增年度重点工作/修改
  addYearWork: async data => {
    const result = await request({
      url: 'dailyWork/addYearBaseWork',
      data
    })
    return result || {}
  },
}
