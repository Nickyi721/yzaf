import request from '@commons/request.js'

export default {
  // 获取年度重点工作详情
  getDetail: async data => {
    const result = await request({
      url: 'dailyWork/getYearBaseWorkDetail',
      data: {
        isQuery: 1,
        requestData: {
          tcNd: data
        }
      }
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
  addYearWorkPast: async data => {
    const result = await request({
      url: 'dailyWork/addYearBaseWorkPast',
      data
    })
    return result || {}
  },
  uploadFile:async data => {
    const result = await request({
      url: '/fileUploadDown/fileUpload',
      data: data
    })
    return result || {}
  },
  closeWork: async data => {
    const result = await request({
      url: 'dailyWork/updateZtByNd',
      data: {
        requestData: {
          tcNd: data
        }
      }
    })
    return result || {}
  },
}
