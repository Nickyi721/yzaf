import request from './request.js'
import utils from './utils.js'

export default {
  // 获取数据字典信息
  getDictData: async data => {
    const result = await request({
      url: '/params/getSjzdListData',
      data: {
        isQuery: 1,
        cdId: utils.getMenuId(),
        requestData: {
          sjbm: data.join(',')
        }
      }
    })
    return result || {}
  },
  // 获取群组下级机构列表
  getGroupFnOrgList: async (api, data) => {
    const result = await request({
      loader: false,
      url: api, // '/xxglQzgl/getQzglTreeByAsync',
      data: {
        isQuery: 1,
        cdId: utils.getMenuId(),
        requestData: data
      }
    })
    return result || []
  },
  // 通用-获取功能机构树下级机构列表
  getFnOrgList: async data => {
    const result = await request({
      loader: false,
      url: '/org/getOrgListTreeByAsync',
      data: {
        isQuery: 1,
        cdId: utils.getMenuId(),
        requestData: data
      }
    })
    return result || []
  },
  // 获取安全保卫机构树下级机构列表
  getAbjgFnOrgList: async data => {
    const result = await request({
      loader: false,
      url: '/abgl/getAbjgListByTreeAsync',
      data: {
        isQuery: 1,
        cdId: utils.getMenuId(),
        requestData: data
      }
    })
    return result || []
  },
  // 安防设施机构树
  getAfssFnOrgList: async data => {
    const result = await request({
      loader: false,
      url: '/safety/getOrgListTreeAfssxx',
      data: {
        isQuery: 1,
        cdId: utils.getMenuId(),
        requestData: data
      }
    })
    return result || []
  },
  // 安全评估-机构树
  getEvalFnOrgList: async data => {
    const result = await request({
      loader: false,
      url: '/org/getJraqByTreeAsync',
      data: {
        isQuery: 1,
        cdId: utils.getMenuId(),
        requestData: data
      }
    })
    return result || []
  },
  // 获取下级机构列表
  getOrgList: async data => {
    const result = await request({
      loader: false,
      url: '/dwxx/getDwxxTreeByAsync',
      data: {
        isQuery: 1,
        cdId: utils.getMenuId(),
        requestData: data
      }
    })
    return result || {}
  },
  // 消防信息-获取下级机构列表
  getXfxxOrgList: async data => {
    const result = await request({
      loader: false,
      url: '/xfxx/getOrgListTreeXfxx',
      data: {
        isQuery: 1,
        cdId: utils.getMenuId(),
        requestData: data
      }
    })
    return result || {}
  },
  downloadFile: async data => {
    const result = await request({
      url: '/zlk/zlkDownload',
      responseType: 'blob', // 表明返回服务器返回的数据类型
      data: {
        isQuery: 0,
        cdId: utils.getMenuId(),
        requestData: data
      }
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
  // 获取是否加密
  getSfjm: async data => {
    const result = await request({
      url: '/system/checkUserId',
      data
    })
    return result || {}
  },
  // 注销登录
  logOut: async data => {
    const result = await request({
      url: '/system/loginOut',
      data
    })
    return result || {}
  }
}
