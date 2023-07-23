import request from '@commons/request.js'

export default {
  // 获取年度重点工作详情
  getList: async data => {
    const result = await request({
      url: 'dailyWork/getYearBaseWork',
      data
    })
    return result || {}
  },
}
