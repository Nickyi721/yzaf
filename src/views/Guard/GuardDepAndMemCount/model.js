import request from '@commons/request.js'

export default {
    // 获取用户列表
    getSecWorkerStatistics: async data => {
        const result = await request({
            url: '/secOrg/getSecWorkerStatistics',
            data
        })
        return result || {}
    },

}