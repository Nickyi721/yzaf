import request from '@commons/request.js';

export default {
  getAgenceNews: async data => {
    const result = await request({
      url: 'fbxx/getXxfbDbztBydwdm',
      data: {
        isQuery: 1,
        requestData: data
      }
    })
    return result || {}
  },

  getUnreadNews: async data => {
    const result = await request({
      url: 'fbxx/getSYXxfbWyxxByUser',
      data: {
        isQuery: 1
      }
    })
    return result || {}
  },
  

  getDownloadData : async data => {
    const result = await request({
      url: 'zlk/getZlkYshByDate',
      data: {
        isQuery: 1
      }
    })
    return result || {}
  },
  // 判断是否填报
  queryRwzt: async data => {
    const result = await request({
      url: 'rwzt/queryRwztList',
      data
    })
    return result || {}
  },

   // 报表填报--保存/提交
   saveForm: async data => {
    const result = await request({
      url: 'rwzt/saveBbtb',
      data
    })
    return result || {}
  },
  // 获取任务详情
  getTaskList: async data => {
    const result = await request({
      url: 'rwfb/queryRwfbList',
      data
    })
    return result || {}
  },

}