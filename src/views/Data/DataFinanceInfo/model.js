import request from '@commons/request.js'

export default {
  // 获取信息项列表
  getListData: async data => {
    const result = await request({
      url: '/paramConfig/getFinSecEvaBasicInfoList',
      data: {
        isQuery: 1,
        requestData: {
          tcXxxlx: data
        }
      }
    })
    return result || {}
  },
  // 保存信息项
  saveListData: async data => {
    const result = await request({
      url: '/paramConfig/saveFinSecEvaBasicInfo',
      data: {
        requestData: data
      }
    })
    return result || {}
  },

}
