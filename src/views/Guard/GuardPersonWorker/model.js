import request from '@commons/request.js'

export default {
    // 获取用户列表
    getSecurityWorkStaffList: async data => {
        const result = await request({
            url: '/abgl/getAbgzryList',
            data: data
        })
        return result || {}
    },
    deleteSecurityWorkStaff: async data => {
        const result = await request({
            url: '/abgl/deleteAbgzry',
            data: data
        })
        return result || {}
    },
    exportTable: async data => {
        const result = await request({
            responseType: 'blob',
            url: 'abgl/exportAbgzryList',
            data
        })
        return result || {}
    }
}