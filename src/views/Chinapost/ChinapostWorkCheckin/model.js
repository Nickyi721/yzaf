import request from '@commons/request.js'

export default {
  // 获取年度重点工作列表
  getList: async data => {
    const result = await request({
      url: 'dailyWork/getYear',
      data
    })
    return result || {}
  },
  // 新增年度重点工作
  addYearWork: async data => {
    const result = await request({
      url: 'dailyWork/addYearBaseWork',
      data
    })
    return result || {}
  },
  uploadFile: async data => {
    const result = await request({
      url: '/fileUploadDown/fileUpload',
      data: data
    })
    return result || {}
  },
}
