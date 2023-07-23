import request from '@commons/request.js'

export default {
  // 安全评估内容设置 查询
  getFinanceInContentData: async data => {
    const result = await request({
      url: '/paramConfig/getFinSecEvaContentList',
      data: {
        isQuery: 1,
        requestData: {
          tcPglx: data
        }
      }
    })
    return result || {}
  },
  // 安全评估内容设置 获取数据库中当前最大内容编号
  getFinanceInContentMaxBh: async data => {
    const result = await request({
      url: '/paramConfig/getMaxNrbh',
      data: {
        requestData: {}
      }
    })
    return result || {}
  },
  // 安全评估内容设置 保存
  saveFinanceInContentData: async (deleteData, addUpdateData) => {
    const result = await request({
      url: '/paramConfig/saveFinSecEvaContentList',
      data: {
        requestData: {
          update: addUpdateData,
          delete: deleteData
        }
      }
    })
    return result || {}
  }
}
